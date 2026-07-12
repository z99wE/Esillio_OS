"""
EsiWell Forge

Dataset Downloader

Downloads datasets defined in datasets/sources.yaml.
"""

from pathlib import Path
import hashlib
import shutil
import urllib.request

import yaml

from config import CACHE, DATASETS


MANIFEST = DATASETS / "sources.yaml"


def sha256(path: Path) -> str:
    h = hashlib.sha256()

    with path.open("rb") as f:
        while True:
            chunk = f.read(1024 * 1024)

            if not chunk:
                break

            h.update(chunk)

    return h.hexdigest()


def download(url: str, destination: Path):

    with urllib.request.urlopen(url) as response:

        with destination.open("wb") as out:

            shutil.copyfileobj(response, out)


def run():

    if not MANIFEST.exists():

        raise FileNotFoundError(
            f"Manifest not found: {MANIFEST}"
        )

    with MANIFEST.open(
        "r",
        encoding="utf-8",
    ) as f:

        manifest = yaml.safe_load(f)

    sources = manifest.get(
        "sources",
        [],
    )

    if not sources:

        print("No datasets configured.")

        return

    for source in sources:

        filename = source["filename"]

        url = source["url"]

        destination = CACHE / filename

        print(f"Downloading {filename}")

        download(
            url,
            destination,
        )

        print(
            f"✓ {filename} "
            f"({destination.stat().st_size/1024/1024:.2f} MB)"
        )

        print(
            "SHA256:",
            sha256(destination),
        )

        print()


if __name__ == "__main__":

    run()