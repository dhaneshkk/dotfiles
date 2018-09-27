import builtins as _mod_builtins
import itertools as _mod_itertools

__all__ = _mod_builtins.list()
__builtins__ = {}
__doc__ = None
__file__ = '/home/dhanesh/anaconda3/envs/spacy/lib/python3.6/site-packages/cytoolz/recipes.cpython-36m-x86_64-linux-gnu.so'
__name__ = 'cytoolz.recipes'
__package__ = 'cytoolz'
__pyx_capi__ = _mod_builtins.dict()
def __reduce_cython__(self):
    'partitionby.__reduce_cython__(self)'
    pass

def __setstate_cython__(self, __pyx_state):
    'partitionby.__setstate_cython__(self, __pyx_state)'
    pass

__test__ = _mod_builtins.dict()
def countby(key, seq):
    "countby(key, seq)\n\n    Count elements of a collection by a key function\n\n    >>> countby(len, ['cat', 'mouse', 'dog'])\n    {3: 2, 5: 1}\n\n    >>> def iseven(x): return x % 2 == 0\n    >>> countby(iseven, [1, 2, 3])  # doctest:+SKIP\n    {True: 1, False: 2}\n\n    See Also:\n        groupby\n    "
    pass

groupby = _mod_itertools.groupby
map = _mod_builtins.map
class partitionby(_mod_builtins.object):
    ' partitionby(func, seq)\n\n    Partition a sequence according to a function\n\n    Partition `s` into a sequence of lists such that, when traversing\n    `s`, every time the output of `func` changes a new list is started\n    and that and subsequent items are collected into that list.\n\n    >>> is_space = lambda c: c == " "\n    >>> list(partitionby(is_space, "I have space"))\n    [(\'I\',), (\' \',), (\'h\', \'a\', \'v\', \'e\'), (\' \',), (\'s\', \'p\', \'a\', \'c\', \'e\')]\n\n    >>> is_large = lambda x: x > 10\n    >>> list(partitionby(is_large, [1, 2, 1, 99, 88, 33, 99, -1, 5]))\n    [(1, 2, 1), (99, 88, 33, 99), (-1, 5)]\n\n    See also:\n        partition\n        groupby\n        itertools.groupby\n    '
    __class__ = partitionby
    def __init__(self, func, seq):
        ' partitionby(func, seq)\n\n    Partition a sequence according to a function\n\n    Partition `s` into a sequence of lists such that, when traversing\n    `s`, every time the output of `func` changes a new list is started\n    and that and subsequent items are collected into that list.\n\n    >>> is_space = lambda c: c == " "\n    >>> list(partitionby(is_space, "I have space"))\n    [(\'I\',), (\' \',), (\'h\', \'a\', \'v\', \'e\'), (\' \',), (\'s\', \'p\', \'a\', \'c\', \'e\')]\n\n    >>> is_large = lambda x: x > 10\n    >>> list(partitionby(is_large, [1, 2, 1, 99, 88, 33, 99, -1, 5]))\n    [(1, 2, 1), (99, 88, 33, 99), (-1, 5)]\n\n    See also:\n        partition\n        groupby\n        itertools.groupby\n    '
        pass

    @classmethod
    def __init_subclass__(cls):
        'This method is called when a class is subclassed.\n\nThe default implementation does nothing. It may be\noverridden to extend subclasses.\n'
        return None

    def __iter__(self):
        'Implement iter(self).'
        return partitionby()

    def __next__(self):
        pass

    def __reduce__(self):
        'partitionby.__reduce_cython__(self)'
        return ''; return ()

    def __setstate__(self, state):
        'partitionby.__setstate_cython__(self, __pyx_state)'
        return None

    @classmethod
    def __subclasshook__(cls, subclass):
        'Abstract classes can override this to customize issubclass().\n\nThis is invoked early on by abc.ABCMeta.__subclasscheck__().\nIt should return True, False or NotImplemented.  If it returns\nNotImplemented, the normal algorithm is used.  Otherwise, it\noverrides the normal algorithm (and the outcome is cached).\n'
        return False


