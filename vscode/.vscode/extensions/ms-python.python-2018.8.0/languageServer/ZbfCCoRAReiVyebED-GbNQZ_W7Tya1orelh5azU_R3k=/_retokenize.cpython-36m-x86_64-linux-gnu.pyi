import builtins as _mod_builtins
import spacy.util as _mod_spacy_util

class Retokenizer(_mod_builtins.object):
    'Helper class for doc.retokenize() context manager.'
    __class__ = Retokenizer
    def __enter__(self):
        return self

    def __exit__(self):
        pass

    def __init__(self):
        'Helper class for doc.retokenize() context manager.'
        pass

    @classmethod
    def __init_subclass__(cls):
        'This method is called when a class is subclassed.\n\nThe default implementation does nothing. It may be\noverridden to extend subclasses.\n'
        return None

    def __reduce__(self):
        return ''; return ()

    def __setstate__(self, state):
        return None

    @classmethod
    def __subclasshook__(cls, subclass):
        'Abstract classes can override this to customize issubclass().\n\nThis is invoked early on by abc.ABCMeta.__subclasscheck__().\nIt should return True, False or NotImplemented.  If it returns\nNotImplemented, the normal algorithm is used.  Otherwise, it\noverrides the normal algorithm (and the outcome is cached).\n'
        return False

    def merge(self):
        'Mark a span for merging. The attrs will be applied to the resulting\n        token.\n        '
        pass

    def split(self):
        'Mark a Token for splitting, into the specified orths. The attrs\n        will be applied to each subtoken.\n        '
        pass


SimpleFrozenDict = _mod_spacy_util.SimpleFrozenDict
__builtins__ = {}
__doc__ = None
__file__ = '/home/dhanesh/anaconda3/envs/spacy/lib/python3.6/site-packages/spacy/tokens/_retokenize.cpython-36m-x86_64-linux-gnu.so'
__name__ = 'spacy.tokens._retokenize'
__package__ = 'spacy.tokens'
def __pyx_unpickle_Retokenizer():
    pass

__test__ = _mod_builtins.dict()
def _merge():
    'Retokenize the document, such that the span at\n    `doc.text[start_idx : end_idx]` is merged into a single token. If\n    `start_idx` and `end_idx `do not mark start and end token boundaries,\n    the document remains unchanged.\n\n    start_idx (int): Character index of the start of the slice to merge.\n    end_idx (int): Character index after the end of the slice to merge.\n    **attributes: Attributes to assign to the merged token. By default,\n        attributes are inherited from the syntactic root of the span.\n    RETURNS (Token): The newly merged token, or `None` if the start and end\n        indices did not fall at token boundaries.\n    '
    pass

def intify_attrs():
    '\n    Normalize a dictionary of attributes, converting them to ints.\n\n    stringy_attrs (dict): Dictionary keyed by attribute string names. Values\n        can be ints or strings.\n    strings_map (StringStore): Defaults to None. If provided, encodes string\n        values into ints.\n    RETURNS (dict): Attributes dictionary with keys and optionally values\n        converted to ints.\n    '
    pass

