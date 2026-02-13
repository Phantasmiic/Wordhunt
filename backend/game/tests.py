from django.test import SimpleTestCase

from .dictionary import is_valid_word
from .logic import score_for_word


class ScoringTests(SimpleTestCase):
    def test_score_lookup(self):
        self.assertEqual(score_for_word('cat'), 100)
        self.assertEqual(score_for_word('word'), 400)
        self.assertEqual(score_for_word('plate'), 800)
        self.assertEqual(score_for_word('planet'), 1400)
        self.assertEqual(score_for_word('puzzled'), 1800)
        self.assertEqual(score_for_word('elephant'), 2200)
        self.assertEqual(score_for_word('xylophone'), 2200)
        self.assertEqual(score_for_word('it'), 0)


class DictionaryTests(SimpleTestCase):
    def test_minimum_word_length(self):
        self.assertFalse(is_valid_word('an'))

    def test_dictionary_lookup_with_seed_words(self):
        self.assertTrue(is_valid_word('apple'))
        self.assertFalse(is_valid_word('zzzznotaword'))
