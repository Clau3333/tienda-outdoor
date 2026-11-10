"""Create an isolated source snapshot or delivery ZIP using only Python's standard library.

Run from any directory: python react-app/tools/prepare-delivery.py --snapshot NEW_FOLDER
or: python react-app/tools/prepare-delivery.py --zip NEW_ARCHIVE.zip
Never includes Git, installed dependencies, generated test data or personal continuity.
"""
import argparse
import hashlib
import json
from pathlib import Path
import re
import shutil
import zipfile

ROOT = Path(__file__).resolve().parents[2]
EXCLUDED_DIRS = {'.git', 'node_modules', 'dist', 'dist-ssr', '.karma-tmp', 'test-results', '__pycache__', '.agents', '.codex', '.aws', '.ssh', '.vscode', 'entregas'}
ALLOWED_SUFFIXES = {'.md', '.json', '.html', '.css', '.ts', '.tsx', '.js', '.mjs', '.cjs', '.py', '.svg', '.png', '.mp4', '.pdf', '.docx', '.xlsx'}


def files():
    candidates = [ROOT / 'README.md', ROOT / '.gitignore']
    for folder in ('react-app', 'Sitio Old', 'docs'):
        for path in (ROOT / folder).rglob('*'):
            relative = path.relative_to(ROOT)
            if any(part in EXCLUDED_DIRS for part in relative.parts):
                continue
            if path.is_symlink():
                raise ValueError('A symbolic link cannot be distributed')
            if path.is_file():
                candidates.append(path)
    for path in sorted(set(candidates)):
        name = path.name.lower()
        if name != '.gitignore' and path.suffix.lower() not in ALLOWED_SUFFIXES:
            raise ValueError('Unexpected file extension: ' + str(path.relative_to(ROOT)))
        if any(word in name for word in ('continuidad', 'credential', 'secret', 'token', 'auth.json', '.env', '.bak')):
            raise ValueError('Private or unexpected filename: ' + str(path.relative_to(ROOT)))
        if not path.is_file() or not path.stat().st_size:
            raise ValueError('Missing or empty file: ' + str(path.relative_to(ROOT)))
        if path.suffix.lower() in {'.md', '.json', '.html', '.css', '.ts', '.tsx', '.js', '.mjs', '.cjs', '.py'}:
            text = path.read_text(encoding='utf-8-sig')
            if re.search(r'(?i)[A-Z]:[\\/]Users[\\/]|/(?:Users|home)/[A-Za-z0-9_.-]+/|-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----|github_pat_[A-Za-z0-9_]{20,}|gh[pousr]_[A-Za-z0-9]{20,}|AKIA[A-Z0-9]{16}', text):
                raise ValueError('Privacy review required: ' + str(path.relative_to(ROOT)))
        yield path


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    choice = parser.add_mutually_exclusive_group(required=True)
    choice.add_argument('--snapshot', type=Path)
    choice.add_argument('--zip', type=Path)
    args = parser.parse_args()
    paths = list(files())  # Complete validation before writing anything.
    target = (args.snapshot or args.zip).resolve()
    if target.exists():
        raise ValueError('Destination already exists; nothing overwritten')
    if args.snapshot and (target == ROOT or ROOT in target.parents):
        raise ValueError('Snapshot must be outside the source project')
    manifest = {str(p.relative_to(ROOT)).replace('\\', '/'): hashlib.sha256(p.read_bytes()).hexdigest() for p in paths}
    target.parent.mkdir(parents=True, exist_ok=True)
    if args.snapshot:
        target.mkdir()
        for source in paths:
            destination = target / source.relative_to(ROOT)
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source, destination)
            if hashlib.sha256(destination.read_bytes()).hexdigest() != manifest[str(source.relative_to(ROOT)).replace('\\', '/')]:
                raise ValueError('Snapshot copy differs from source')
    else:
        with zipfile.ZipFile(target, 'x', zipfile.ZIP_DEFLATED) as archive:
            for source in paths:
                archive.write(source, str(source.relative_to(ROOT)).replace('\\', '/'))
            archive.writestr('INVENTARIO-SHA256.json', json.dumps(manifest, indent=2) + '\n')
        with zipfile.ZipFile(target) as archive:
            if archive.testzip() is not None:
                raise ValueError('ZIP integrity failed')
            for relative, digest in manifest.items():
                if hashlib.sha256(archive.read(relative)).hexdigest() != digest:
                    raise ValueError('ZIP contents differ from source')
    print(json.dumps({'files': len(paths), 'mode': 'snapshot' if args.snapshot else 'zip', 'integrity': 'SHA256 OK'}))


if __name__ == '__main__':
    main()
