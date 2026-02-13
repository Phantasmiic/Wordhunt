import logging

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .dictionary import validate_word

logger = logging.getLogger('game')


class HealthView(APIView):
    def get(self, request):
        return Response({'status': 'ok'})


class GameConfigView(APIView):
    def get(self, request):
        return Response(
            {
                'default_board_size': 4,
                'default_duration_seconds': 80,
                'default_end_condition': 'timer',
                'supported_board_sizes': [3, 4, 5, 6],
                'supported_layouts': ['random', 'balanced_vowels'],
                'supported_end_conditions': ['timer'],
            }
        )


class ValidateWordView(APIView):
    def post(self, request):
        word = request.data.get('word', '')
        validation = validate_word(word)
        logger.debug(
            'validate_word word="%s" valid=%s reason=%s',
            word,
            validation['valid'],
            validation['reason'],
        )
        return Response(
            {
                'word': word,
                'valid': validation['valid'],
                'reason': validation['reason'],
            },
            status=status.HTTP_200_OK,
        )
