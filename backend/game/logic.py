SCORE_BY_LENGTH = {
    3: 100,
    4: 400,
    5: 800,
    6: 1400,
    7: 1800,
    8: 2200,
}


def score_for_word(word: str) -> int:
    word_length = len(word)
    if word_length < 3:
        return 0
    if word_length >= 8:
        return SCORE_BY_LENGTH[8]
    return SCORE_BY_LENGTH.get(word_length, 0)
