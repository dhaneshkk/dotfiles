import builtins as _mod_builtins
import spacy.tokens._retokenize as _mod_spacy_tokens__retokenize
import spacy.tokens.underscore as _mod_spacy_tokens_underscore

class Doc(_mod_builtins.object):
    "A sequence of Token objects. Access sentences and named entities, export\n    annotations to numpy arrays, losslessly serialize to compressed binary\n    strings. The `Doc` object holds an array of `TokenC` structs. The\n    Python-level `Token` and `Span` objects are views of this array, i.e.\n    they don't own the data themselves.\n\n    EXAMPLE: Construction 1\n        >>> doc = nlp(u'Some text')\n\n        Construction 2\n        >>> from spacy.tokens import Doc\n        >>> doc = Doc(nlp.vocab, words=[u'hello', u'world', u'!'],\n                      spaces=[True, False, False])\n    "
    @property
    def _(self):
        pass

    def __bytes__(self):
        pass

    __class__ = Doc
    def __getitem__(self, index):
        'Get a `Token` or `Span` object.\n\n        i (int or tuple) The index of the token, or the slice of the document\n            to get.\n        RETURNS (Token or Span): The token at `doc[i]]`, or the span at\n            `doc[start : end]`.\n\n        EXAMPLE:\n            >>> doc[i]\n            Get the `Token` object at position `i`, where `i` is an integer.\n            Negative indexing is supported, and follows the usual Python\n            semantics, i.e. `doc[-2]` is `doc[len(doc) - 2]`.\n\n            >>> doc[start : end]]\n            Get a `Span` object, starting at position `start` and ending at\n            position `end`, where `start` and `end` are token indices. For\n            instance, `doc[2:5]` produces a span consisting of tokens 2, 3 and\n            4. Stepped slices (e.g. `doc[start : end : step]`) are not\n            supported, as `Span` objects must be contiguous (cannot have gaps).\n            You can use negative indices and open-ended ranges, which have\n            their normal Python semantics.\n        '
        pass

    def __init__(self):
        'Create a Doc object.\n\n        vocab (Vocab): A vocabulary object, which must match any models you\n            want to use (e.g. tokenizer, parser, entity recognizer).\n        words (list or None): A list of unicode strings to add to the document\n            as words. If `None`, defaults to empty list.\n        spaces (list or None): A list of boolean values, of the same length as\n            words. True means that the word is followed by a space, False means\n            it is not. If `None`, defaults to `[True]*len(words)`\n        user_data (dict or None): Optional extra data to attach to the Doc.\n        RETURNS (Doc): The newly constructed object.\n        '
        pass

    @classmethod
    def __init_subclass__(cls):
        'This method is called when a class is subclassed.\n\nThe default implementation does nothing. It may be\noverridden to extend subclasses.\n'
        return None

    def __iter__(self):
        'Iterate over `Token`  objects, from which the annotations can be\n        easily accessed. This is the main way of accessing `Token` objects,\n        which are the main way annotations are accessed from Python. If faster-\n        than-Python speeds are required, you can instead access the annotations\n        as a numpy array, or access the underlying C data directly from Cython.\n\n        EXAMPLE:\n            >>> for token in doc\n        '
        return Doc()

    def __len__(self):
        'The number of tokens in the document.\n\n        RETURNS (int): The number of tokens in the document.\n\n        EXAMPLE:\n            >>> len(doc)\n        '
        return 0

    __pyx_vtable__ = _mod_builtins.PyCapsule()
    def __reduce__(self):
        return ''; return ()

    def __repr__(self):
        'Return repr(self).'
        return ''

    def __setstate__(self, state):
        return None

    def __str__(self):
        'Return str(self).'
        return ''

    @classmethod
    def __subclasshook__(cls, subclass):
        'Abstract classes can override this to customize issubclass().\n\nThis is invoked early on by abc.ABCMeta.__subclasscheck__().\nIt should return True, False or NotImplemented.  If it returns\nNotImplemented, the normal algorithm is used.  Otherwise, it\noverrides the normal algorithm (and the outcome is cached).\n'
        return False

    def __unicode__(self):
        pass

    @property
    def _py_tokens(self):
        pass

    def _realloc(self):
        pass

    @property
    def _vector(self):
        pass

    @property
    def _vector_norm(self):
        pass

    @property
    def cats(self):
        pass

    def char_span(self):
        "Create a `Span` object from the slice `doc.text[start : end]`.\n\n        doc (Doc): The parent document.\n        start (int): The index of the first character of the span.\n        end (int): The index of the first character after the span.\n        label (uint64 or string): A label to attach to the Span, e.g. for\n            named entities.\n        vector (ndarray[ndim=1, dtype='float32']): A meaning representation of\n            the span.\n        RETURNS (Span): The newly constructed object.\n        "
        pass

    def count_by(self):
        "Count the frequencies of a given attribute. Produces a dict of\n        `{attribute (int): count (ints)}` frequencies, keyed by the values of\n        the given attribute ID.\n\n        attr_id (int): The attribute ID to key the counts.\n        RETURNS (dict): A dictionary mapping attributes to integer counts.\n\n        EXAMPLE:\n            >>> from spacy import attrs\n            >>> doc = nlp(u'apple apple orange banana')\n            >>> tokens.count_by(attrs.ORTH)\n            {12800L: 1, 11880L: 2, 7561L: 1}\n            >>> tokens.to_array([attrs.ORTH])\n            array([[11880], [11880], [7561], [12800]])\n        "
        pass

    @property
    def doc(self):
        pass

    @property
    def ents(self):
        "Iterate over the entities in the document. Yields named-entity\n        `Span` objects, if the entity recognizer has been applied to the\n        document.\n\n        YIELDS (Span): Entities in the document.\n\n        EXAMPLE: Iterate over the span to get individual Token objects,\n            or access the label:\n\n            >>> tokens = nlp(u'Mr. Best flew to New York on Saturday morning.')\n            >>> ents = list(tokens.ents)\n            >>> assert ents[0].label == 346\n            >>> assert ents[0].label_ == 'PERSON'\n            >>> assert ents[0].orth_ == 'Best'\n            >>> assert ents[0].text == 'Mr. Best'\n        "
        pass

    def extend_tensor(self):
        "Concatenate a new tensor onto the doc.tensor object.\n\n        The doc.tensor attribute holds dense feature vectors\n        computed by the models in the pipeline. Let's say a\n        document with 30 words has a tensor with 128 dimensions\n        per word. doc.tensor.shape will be (30, 128). After\n        calling doc.extend_tensor with an array of shape (30, 64),\n        doc.tensor == (30, 192).\n        "
        pass

    def from_array(self):
        pass

    def from_bytes(self):
        'Deserialize, i.e. import the document contents from a binary string.\n\n        data (bytes): The string to load from.\n        RETURNS (Doc): Itself.\n        '
        pass

    def from_disk(self):
        'Loads state from a directory. Modifies the object in place and\n        returns it.\n\n        path (unicode or Path): A path to a directory. Paths may be either\n            strings or `Path`-like objects.\n        RETURNS (Doc): The modified `Doc` object.\n        '
        pass

    @classmethod
    def get_extension(cls):
        pass

    def get_lca_matrix(self):
        'Calculates the lowest common ancestor matrix for a given `Doc`.\n        Returns LCA matrix containing the integer index of the ancestor, or -1\n        if no common ancestor is found (ex if span excludes a necessary\n        ancestor). Apologies about the recursion, but the impact on\n        performance is negligible given the natural limitations on the depth\n        of a typical human sentence.\n        '
        pass

    @classmethod
    def has_extension(cls):
        pass

    @property
    def has_vector(self):
        'A boolean value indicating whether a word vector is associated with\n        the object.\n\n        RETURNS (bool): Whether a word vector is associated with the object.\n        '
        pass

    @property
    def is_parsed(self):
        pass

    @property
    def is_sentenced(self):
        pass

    @property
    def is_tagged(self):
        pass

    @property
    def mem(self):
        pass

    def merge(self):
        'Retokenize the document, such that the span at\n        `doc.text[start_idx : end_idx]` is merged into a single token. If\n        `start_idx` and `end_idx `do not mark start and end token boundaries,\n        the document remains unchanged.\n\n        start_idx (int): Character index of the start of the slice to merge.\n        end_idx (int): Character index after the end of the slice to merge.\n        **attributes: Attributes to assign to the merged token. By default,\n            attributes are inherited from the syntactic root of the span.\n        RETURNS (Token): The newly merged token, or `None` if the start and end\n            indices did not fall at token boundaries.\n        '
        pass

    @property
    def noun_chunks(self):
        'Iterate over the base noun phrases in the document. Yields base\n        noun-phrase #[code Span] objects, if the document has been\n        syntactically parsed. A base noun phrase, or "NP chunk", is a noun\n        phrase that does not permit other NPs to be nested within it – so no\n        NP-level coordination, no prepositional phrases, and no relative\n        clauses.\n\n        YIELDS (Span): Noun chunks in the document.\n        '
        pass

    @property
    def noun_chunks_iterator(self):
        pass

    def print_tree(self):
        "Returns the parse trees in JSON (dict) format.\n\n        light (bool): Don't include lemmas or entities.\n        flat (bool): Don't include arcs or modifiers.\n        RETURNS (dict): Parse tree as dict.\n\n        EXAMPLE:\n            >>> doc = nlp('Bob brought Alice the pizza. Alice ate the pizza.')\n            >>> trees = doc.print_tree()\n            >>> trees[1]\n            {'modifiers': [\n                {'modifiers': [], 'NE': 'PERSON', 'word': 'Alice',\n                'arc': 'nsubj', 'POS_coarse': 'PROPN', 'POS_fine': 'NNP',\n                'lemma': 'Alice'},\n                {'modifiers': [\n                    {'modifiers': [], 'NE': '', 'word': 'the', 'arc': 'det',\n                    'POS_coarse': 'DET', 'POS_fine': 'DT', 'lemma': 'the'}],\n                'NE': '', 'word': 'pizza', 'arc': 'dobj', 'POS_coarse': 'NOUN',\n                'POS_fine': 'NN', 'lemma': 'pizza'},\n                {'modifiers': [], 'NE': '', 'word': '.', 'arc': 'punct',\n                'POS_coarse': 'PUNCT', 'POS_fine': '.', 'lemma': '.'}],\n                'NE': '', 'word': 'ate', 'arc': 'ROOT', 'POS_coarse': 'VERB',\n                'POS_fine': 'VBD', 'lemma': 'eat'}\n        "
        pass

    @classmethod
    def remove_extension(cls):
        pass

    def retokenize(self):
        "Context manager to handle retokenization of the Doc.\n        Modifications to the Doc's tokenization are stored, and then\n        made all at once when the context manager exits. This is\n        much more efficient, and less error-prone.\n\n        All views of the Doc (Span and Token) created before the\n        retokenization are invalidated, although they may accidentally\n        continue to work.\n        "
        pass

    @property
    def sentiment(self):
        pass

    @property
    def sents(self):
        'Iterate over the sentences in the document. Yields sentence `Span`\n        objects. Sentence spans have no label. To improve accuracy on informal\n        texts, spaCy calculates sentence boundaries from the syntactic\n        dependency parse. If the parser is disabled, the `sents` iterator will\n        be unavailable.\n\n        EXAMPLE:\n            >>> doc = nlp("This is a sentence. Here\'s another...")\n            >>> assert [s.root.text for s in doc.sents] == ["is", "\'s"]\n        '
        pass

    @classmethod
    def set_extension(cls):
        pass

    def similarity(self):
        'Make a semantic similarity estimate. The default estimate is cosine\n        similarity using an average of word vectors.\n\n        other (object): The object to compare with. By default, accepts `Doc`,\n            `Span`, `Token` and `Lexeme` objects.\n        RETURNS (float): A scalar similarity score. Higher is more similar.\n        '
        pass

    @property
    def tensor(self):
        pass

    @property
    def text(self):
        'A unicode representation of the document text.\n\n        RETURNS (unicode): The original verbatim text of the document.\n        '
        pass

    @property
    def text_with_ws(self):
        'An alias of `Doc.text`, provided for duck-type compatibility with\n        `Span` and `Token`.\n\n        RETURNS (unicode): The original verbatim text of the document.\n        '
        pass

    def to_array(self):
        "Export given token attributes to a numpy `ndarray`.\n        If `attr_ids` is a sequence of M attributes, the output array will be\n        of shape `(N, M)`, where N is the length of the `Doc` (in tokens). If\n        `attr_ids` is a single attribute, the output shape will be (N,). You\n        can specify attributes by integer ID (e.g. spacy.attrs.LEMMA) or\n        string name (e.g. 'LEMMA' or 'lemma').\n\n        attr_ids (list[]): A list of attributes (int IDs or string names).\n        RETURNS (numpy.ndarray[long, ndim=2]): A feature matrix, with one row\n            per word, and one column per attribute indicated in the input\n            `attr_ids`.\n\n        EXAMPLE:\n            >>> from spacy.attrs import LOWER, POS, ENT_TYPE, IS_ALPHA\n            >>> doc = nlp(text)\n            >>> # All strings mapped to integers, for easy export to numpy\n            >>> np_array = doc.to_array([LOWER, POS, ENT_TYPE, IS_ALPHA])\n        "
        pass

    def to_bytes(self):
        'Serialize, i.e. export the document contents to a binary string.\n\n        RETURNS (bytes): A losslessly serialized copy of the `Doc`, including\n            all annotations.\n        '
        pass

    def to_disk(self):
        "Save the current state to a directory.\n\n        path (unicode or Path): A path to a directory, which will be created if\n            it doesn't exist. Paths may be either strings or Path-like objects.\n        "
        pass

    @property
    def user_data(self):
        pass

    @property
    def user_hooks(self):
        pass

    @property
    def user_span_hooks(self):
        pass

    @property
    def user_token_hooks(self):
        pass

    @property
    def vector(self):
        "A real-valued meaning representation. Defaults to an average of the\n        token vectors.\n\n        RETURNS (numpy.ndarray[ndim=1, dtype='float32']): A 1D numpy array\n            representing the document's semantics.\n        "
        pass

    @property
    def vector_norm(self):
        "The L2 norm of the document's vector representation.\n\n        RETURNS (float): The L2 norm of the vector representation.\n        "
        pass

    @property
    def vocab(self):
        pass


def Errors():
    '[__doc__] None'
    pass

IDS = _mod_builtins.dict()
Retokenizer = _mod_spacy_tokens__retokenize.Retokenizer
Underscore = _mod_spacy_tokens_underscore.Underscore
def Warnings():
    '[__doc__] None'
    pass

__builtins__ = {}
__doc__ = None
__file__ = '/home/dhanesh/anaconda3/envs/spacy/lib/python3.6/site-packages/spacy/tokens/doc.cpython-36m-x86_64-linux-gnu.so'
__name__ = 'spacy.tokens.doc'
__package__ = 'spacy.tokens'
__pyx_capi__ = _mod_builtins.dict()
__test__ = _mod_builtins.dict()
def _get_chunker():
    pass

basestring_ = _mod_builtins.str
def copy_array(dst, src, casting, where):
    pass

def deprecation_warning(message):
    pass

def get_array_module(_):
    pass

def get_ext_args(**kwargs):
    'Validate and convert arguments. Reused in Doc, Token and Span.'
    pass

def intify_attrs():
    '\n    Normalize a dictionary of attributes, converting them to ints.\n\n    stringy_attrs (dict): Dictionary keyed by attribute string names. Values\n        can be ints or strings.\n    strings_map (StringStore): Defaults to None. If provided, encodes string\n        values into ints.\n    RETURNS (dict): Attributes dictionary with keys and optionally values\n        converted to ints.\n    '
    pass

def is_config(python2, python3, windows, linux, osx):
    pass

def normalize_slice(length, start, stop, step):
    pass

def parse_tree(doc, light, flat):
    "Make a copy of the doc and construct a syntactic parse tree similar to\n    displaCy. Generates the POS tree for all sentences in a doc.\n\n    doc (Doc): The doc for parsing.\n    RETURNS (dict): The parse tree.\n\n    EXAMPLE:\n        >>> doc = nlp('Bob brought Alice the pizza. Alice ate the pizza.')\n        >>> trees = doc.print_tree()\n        >>> trees[1]\n        {'modifiers': [\n            {'modifiers': [], 'NE': 'PERSON', 'word': 'Alice', 'arc': 'nsubj',\n             'POS_coarse': 'PROPN', 'POS_fine': 'NNP', 'lemma': 'Alice'},\n            {'modifiers': [\n                {'modifiers': [], 'NE': '', 'word': 'the', 'arc': 'det',\n                 'POS_coarse': 'DET', 'POS_fine': 'DT', 'lemma': 'the'}],\n             'NE': '', 'word': 'pizza', 'arc': 'dobj', 'POS_coarse': 'NOUN',\n             'POS_fine': 'NN', 'lemma': 'pizza'},\n            {'modifiers': [], 'NE': '', 'word': '.', 'arc': 'punct',\n             'POS_coarse': 'PUNCT', 'POS_fine': '.', 'lemma': '.'}],\n            'NE': '', 'word': 'ate', 'arc': 'ROOT', 'POS_coarse': 'VERB',\n            'POS_fine': 'VBD', 'lemma': 'eat'}\n    "
    pass

def pickle_doc():
    pass

def unpickle_doc():
    pass

