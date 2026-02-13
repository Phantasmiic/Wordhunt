import os
from functools import lru_cache
from pathlib import Path

DEFAULT_DICTIONARY_PATH = Path(__file__).resolve().parent.parent / 'dictionary' / 'scrabble_words.txt'
DICTIONARY_PATH = Path(os.getenv('SCRABBLE_DICTIONARY_PATH', str(DEFAULT_DICTIONARY_PATH)))


def _load_words_from_file(path: Path) -> set[str]:
    words: set[str] = set()
    with path.open('r', encoding='utf-8', errors='ignore') as file_obj:
        for line in file_obj:
            word = line.strip().lower()
            if len(word) >= 3 and word.isalpha():
                words.add(word)
    return words


@lru_cache(maxsize=1)
def _cached_file_words(path_str: str, mtime: float) -> set[str]:
    return _load_words_from_file(Path(path_str))


def load_dictionary() -> set[str]:
    if not DICTIONARY_PATH.exists():
        return set()
    stat = DICTIONARY_PATH.stat()
    return _cached_file_words(str(DICTIONARY_PATH), stat.st_mtime)


def is_valid_word(word: str) -> bool:
    candidate = word.strip().lower()
    if len(candidate) < 3:
        return False
    return candidate in load_dictionary()


def validate_word(word: str) -> dict:
    candidate = word.strip().lower()
    if len(candidate) < 3:
        return {'valid': False, 'reason': 'too_short'}
    if not candidate.isalpha():
        return {'valid': False, 'reason': 'invalid_chars'}

    dictionary = load_dictionary()
    if not dictionary:
        return {'valid': False, 'reason': 'dictionary_unavailable'}

    if candidate in dictionary:
        return {'valid': True, 'reason': 'ok'}
    return {'valid': False, 'reason': 'not_found'}
