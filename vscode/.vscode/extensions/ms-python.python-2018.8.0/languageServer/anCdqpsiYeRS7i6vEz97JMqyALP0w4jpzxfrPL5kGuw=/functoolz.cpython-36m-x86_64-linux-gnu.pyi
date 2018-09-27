import builtins as _mod_builtins
import functools as _mod_functools
import operator as _mod_operator
import toolz.functoolz as _mod_toolz_functoolz

class Compose(_mod_builtins.object):
    ' Compose(self, *funcs)\n\n    A composition of functions\n\n    See Also:\n        compose\n    '
    def __call__(self, *args, **kwargs):
        'Call self as a function.'
        pass

    __class__ = Compose
    def __init__(self, *funcs):
        ' Compose(self, *funcs)\n\n    A composition of functions\n\n    See Also:\n        compose\n    '
        pass

    @classmethod
    def __init_subclass__(cls):
        'This method is called when a class is subclassed.\n\nThe default implementation does nothing. It may be\noverridden to extend subclasses.\n'
        return None

    __module__ = 'cytoolz.functoolz'
    __name__ = 'Compose'
    def __reduce__(self):
        'Compose.__reduce__(self)'
        return ''; return ()

    def __setstate__(self, state):
        'Compose.__setstate__(self, state)'
        return None

    @classmethod
    def __subclasshook__(cls, subclass):
        'Abstract classes can override this to customize issubclass().\n\nThis is invoked early on by abc.ABCMeta.__subclasscheck__().\nIt should return True, False or NotImplemented.  If it returns\nNotImplemented, the normal algorithm is used.  Otherwise, it\noverrides the normal algorithm (and the outcome is cached).\n'
        return False

    @property
    def first(self):
        'first: object'
        pass

    @property
    def funcs(self):
        'funcs: tuple'
        pass


InstanceProperty = _mod_toolz_functoolz.InstanceProperty
PY3 = True
PY33 = False
PY34 = False
__all__ = _mod_builtins.list()
__builtins__ = {}
__doc__ = None
__file__ = '/home/dhanesh/anaconda3/envs/spacy/lib/python3.6/site-packages/cytoolz/functoolz.cpython-36m-x86_64-linux-gnu.so'
__name__ = 'cytoolz.functoolz'
__package__ = 'cytoolz'
__pyx_capi__ = _mod_builtins.dict()
def __pyx_unpickle_excepts(__pyx_type, __pyx_checksum, __pyx_state):
    '__pyx_unpickle_excepts(__pyx_type, long __pyx_checksum, __pyx_state)'
    pass

def __reduce_cython__(self):
    'excepts.__reduce_cython__(self)'
    pass

def __setstate_cython__(self, __pyx_state):
    'excepts.__setstate_cython__(self, __pyx_state)'
    pass

__test__ = _mod_builtins.dict()
def _flip(func, a, b):
    "flip(func, a, b)\n\n    Call the function call with the arguments flipped\n\n    This function is curried.\n\n    >>> def div(a, b):\n    ...     return a // b\n    ...\n    >>> flip(div, 2, 6)\n    3\n    >>> div_by_two = flip(div, 2)\n    >>> div_by_two(4)\n    2\n\n    This is particularly useful for built in functions and functions defined\n    in C extensions that accept positional only arguments. For example:\n    isinstance, issubclass.\n\n    >>> data = [1, 'a', 'b', 2, 1.5, object(), 3]\n    >>> only_ints = list(filter(flip(isinstance, int), data))\n    >>> only_ints\n    [1, 2, 3]\n    "
    pass

class _juxt_inner(_mod_builtins.object):
    def __call__(self, *args, **kwargs):
        'Call self as a function.'
        pass

    __class__ = _juxt_inner
    def __init__(self, *args, **kwargs):
        pass

    @classmethod
    def __init_subclass__(cls):
        'This method is called when a class is subclassed.\n\nThe default implementation does nothing. It may be\noverridden to extend subclasses.\n'
        return None

    def __reduce__(self):
        '_juxt_inner.__reduce__(self)'
        return ''; return ()

    @classmethod
    def __subclasshook__(cls, subclass):
        'Abstract classes can override this to customize issubclass().\n\nThis is invoked early on by abc.ABCMeta.__subclasscheck__().\nIt should return True, False or NotImplemented.  If it returns\nNotImplemented, the normal algorithm is used.  Otherwise, it\noverrides the normal algorithm (and the outcome is cached).\n'
        return False

    @property
    def funcs(self):
        'funcs: tuple'
        pass


class _memoize(_mod_builtins.object):
    def __call__(self, *args, **kwargs):
        'Call self as a function.'
        pass

    __class__ = _memoize
    def __get__(self, instance, owner):
        'Return an attribute of instance, which is of type owner.'
        return _memoize()

    @classmethod
    def __init_subclass__(cls):
        'This method is called when a class is subclassed.\n\nThe default implementation does nothing. It may be\noverridden to extend subclasses.\n'
        return None

    __name__ = '_memoize'
    def __reduce__(self):
        '_memoize.__reduce_cython__(self)'
        return ''; return ()

    def __setstate__(self, state):
        '_memoize.__setstate_cython__(self, __pyx_state)'
        return None

    @classmethod
    def __subclasshook__(cls, subclass):
        'Abstract classes can override this to customize issubclass().\n\nThis is invoked early on by abc.ABCMeta.__subclasscheck__().\nIt should return True, False or NotImplemented.  If it returns\nNotImplemented, the normal algorithm is used.  Otherwise, it\noverrides the normal algorithm (and the outcome is cached).\n'
        return False

    @property
    def __wrapped__(self):
        pass


def _restore_curry(cls, func, args, kwargs, is_decorated):
    '_restore_curry(cls, func, args, kwargs, is_decorated)'
    pass

attrgetter = _mod_operator.attrgetter
class complement(_mod_builtins.object):
    ' complement(func)\n\n    Convert a predicate function to its logical complement.\n\n    In other words, return a function that, for inputs that normally\n    yield True, yields False, and vice-versa.\n\n    >>> def iseven(n): return n % 2 == 0\n    >>> isodd = complement(iseven)\n    >>> iseven(2)\n    True\n    >>> isodd(2)\n    False\n    '
    def __call__(self, *args, **kwargs):
        'Call self as a function.'
        pass

    __class__ = complement
    def __init__(self, func):
        ' complement(func)\n\n    Convert a predicate function to its logical complement.\n\n    In other words, return a function that, for inputs that normally\n    yield True, yields False, and vice-versa.\n\n    >>> def iseven(n): return n % 2 == 0\n    >>> isodd = complement(iseven)\n    >>> iseven(2)\n    True\n    >>> isodd(2)\n    False\n    '
        pass

    @classmethod
    def __init_subclass__(cls):
        'This method is called when a class is subclassed.\n\nThe default implementation does nothing. It may be\noverridden to extend subclasses.\n'
        return None

    def __reduce__(self):
        'complement.__reduce__(self)'
        return ''; return ()

    @classmethod
    def __subclasshook__(cls, subclass):
        'Abstract classes can override this to customize issubclass().\n\nThis is invoked early on by abc.ABCMeta.__subclasscheck__().\nIt should return True, False or NotImplemented.  If it returns\nNotImplemented, the normal algorithm is used.  Otherwise, it\noverrides the normal algorithm (and the outcome is cached).\n'
        return False


def compose(*funcs):
    "compose(*funcs)\n\n    Compose functions to operate in series.\n\n    Returns a function that applies other functions in sequence.\n\n    Functions are applied from right to left so that\n    ``compose(f, g, h)(x, y)`` is the same as ``f(g(h(x, y)))``.\n\n    If no arguments are provided, the identity function (f(x) = x) is returned.\n\n    >>> inc = lambda i: i + 1\n    >>> compose(str, inc)(3)\n    '4'\n\n    See Also:\n        pipe\n    "
    pass

class curry(_mod_builtins.object):
    ' curry(self, *args, **kwargs)\n\n    Curry a callable function\n\n    Enables partial application of arguments through calling a function with an\n    incomplete set of arguments.\n\n    >>> def mul(x, y):\n    ...     return x * y\n    >>> mul = curry(mul)\n\n    >>> double = mul(2)\n    >>> double(10)\n    20\n\n    Also supports keyword arguments\n\n    >>> @curry                  # Can use curry as a decorator\n    ... def f(x, y, a=10):\n    ...     return a * (x + y)\n\n    >>> add = f(a=1)\n    >>> add(2, 3)\n    5\n\n    See Also:\n        cytoolz.curried - namespace of curried functions\n                        https://toolz.readthedocs.io/en/latest/curry.html\n    '
    def __call__(self, *args, **kwargs):
        'Call self as a function.'
        pass

    __class__ = curry
    def __eq__(self, value):
        'Return self==value.'
        return False

    def __ge__(self, value):
        'Return self>=value.'
        return False

    def __get__(self, instance, owner):
        'Return an attribute of instance, which is of type owner.'
        return curry()

    def __gt__(self, value):
        'Return self>value.'
        return False

    def __hash__(self):
        'Return hash(self).'
        return 0

    def __init__(self, *args, **kwargs):
        ' curry(self, *args, **kwargs)\n\n    Curry a callable function\n\n    Enables partial application of arguments through calling a function with an\n    incomplete set of arguments.\n\n    >>> def mul(x, y):\n    ...     return x * y\n    >>> mul = curry(mul)\n\n    >>> double = mul(2)\n    >>> double(10)\n    20\n\n    Also supports keyword arguments\n\n    >>> @curry                  # Can use curry as a decorator\n    ... def f(x, y, a=10):\n    ...     return a * (x + y)\n\n    >>> add = f(a=1)\n    >>> add(2, 3)\n    5\n\n    See Also:\n        cytoolz.curried - namespace of curried functions\n                        https://toolz.readthedocs.io/en/latest/curry.html\n    '
        pass

    @classmethod
    def __init_subclass__(cls):
        'This method is called when a class is subclassed.\n\nThe default implementation does nothing. It may be\noverridden to extend subclasses.\n'
        return None

    def __le__(self, value):
        'Return self<=value.'
        return False

    def __lt__(self, value):
        'Return self<value.'
        return False

    __module__ = 'cytoolz.functoolz'
    __name__ = 'curry'
    def __ne__(self, value):
        'Return self!=value.'
        return False

    __qualname__ = 'curry'
    def __reduce__(self):
        'curry.__reduce__(self)'
        return ''; return ()

    def __repr__(self):
        'Return repr(self).'
        return ''

    @property
    def __signature__(self):
        pass

    def __str__(self):
        'Return str(self).'
        return ''

    @classmethod
    def __subclasshook__(cls, subclass):
        'Abstract classes can override this to customize issubclass().\n\nThis is invoked early on by abc.ABCMeta.__subclasscheck__().\nIt should return True, False or NotImplemented.  If it returns\nNotImplemented, the normal algorithm is used.  Otherwise, it\noverrides the normal algorithm (and the outcome is cached).\n'
        return False

    @property
    def _has_unknown_args(self):
        pass

    def _should_curry(self, args, kwargs, exc):
        'curry._should_curry(self, args, kwargs, exc=None)'
        pass

    def _should_curry_internal(self, args, kwargs, exc):
        'curry._should_curry_internal(self, args, kwargs, exc=None)'
        pass

    @property
    def _sigspec(self):
        pass

    @property
    def args(self):
        pass

    def bind(self, *args, **kwargs):
        'curry.bind(self, *args, **kwargs)'
        pass

    def call(self, *args, **kwargs):
        'curry.call(self, *args, **kwargs)'
        pass

    @property
    def func(self):
        pass

    @property
    def keywords(self):
        pass


def dedent(text):
    'Remove any common leading whitespace from every line in `text`.\n\n    This can be used to make triple-quoted strings line up with the left\n    edge of the display, while still presenting them in the source code\n    in indented form.\n\n    Note that tabs and spaces are both treated as whitespace, but they\n    are not equal: the lines "  hello" and "\\thello" are\n    considered to have no common leading whitespace.  (This behaviour is\n    new in Python 2.5; older versions of this module incorrectly\n    expanded tabs before searching for common leading whitespace.)\n    '
    pass

def do(func, x):
    'do(func, x)\n\n    Runs ``func`` on ``x``, returns ``x``\n\n    Because the results of ``func`` are not returned, only the side\n    effects of ``func`` are relevant.\n\n    Logging functions can be made by composing ``do`` with a storage function\n    like ``list.append`` or ``file.write``\n\n    >>> from cytoolz import compose\n    >>> from cytoolz.curried import do\n\n    >>> log = []\n    >>> inc = lambda x: x + 1\n    >>> inc = compose(inc, do(log.append))\n    >>> inc(1)\n    2\n    >>> inc(11)\n    12\n    >>> log\n    [1, 11]\n    '
    pass

class excepts(_mod_builtins.object):
    'excepts(exc, func, handler=return_none)\n\n    A wrapper around a function to catch exceptions and\n    dispatch to a handler.\n\n    This is like a functional try/except block, in the same way that\n    ifexprs are functional if/else blocks.\n\n    Examples\n    --------\n    >>> excepting = excepts(\n    ...     ValueError,\n    ...     lambda a: [1, 2].index(a),\n    ...     lambda _: -1,\n    ... )\n    >>> excepting(1)\n    0\n    >>> excepting(3)\n    -1\n\n    Multiple exceptions and default except clause.\n    >>> excepting = excepts((IndexError, KeyError), lambda a: a[0])\n    >>> excepting([])\n    >>> excepting([1])\n    1\n    >>> excepting({})\n    >>> excepting({0: 1})\n    1\n    '
    def __call__(self, *args, **kwargs):
        'Call self as a function.'
        pass

    __class__ = excepts
    def __init__(self, exc, func, handler=return_none):
        'excepts(exc, func, handler=return_none)\n\n    A wrapper around a function to catch exceptions and\n    dispatch to a handler.\n\n    This is like a functional try/except block, in the same way that\n    ifexprs are functional if/else blocks.\n\n    Examples\n    --------\n    >>> excepting = excepts(\n    ...     ValueError,\n    ...     lambda a: [1, 2].index(a),\n    ...     lambda _: -1,\n    ... )\n    >>> excepting(1)\n    0\n    >>> excepting(3)\n    -1\n\n    Multiple exceptions and default except clause.\n    >>> excepting = excepts((IndexError, KeyError), lambda a: a[0])\n    >>> excepting([])\n    >>> excepting([1])\n    1\n    >>> excepting({})\n    >>> excepting({0: 1})\n    1\n    '
        pass

    @classmethod
    def __init_subclass__(cls):
        'This method is called when a class is subclassed.\n\nThe default implementation does nothing. It may be\noverridden to extend subclasses.\n'
        return None

    __name__ = 'excepts'
    def __reduce__(self):
        'excepts.__reduce_cython__(self)'
        return ''; return ()

    def __setstate__(self, state):
        'excepts.__setstate_cython__(self, __pyx_state)'
        return None

    @classmethod
    def __subclasshook__(cls, subclass):
        'Abstract classes can override this to customize issubclass().\n\nThis is invoked early on by abc.ABCMeta.__subclasscheck__().\nIt should return True, False or NotImplemented.  If it returns\nNotImplemented, the normal algorithm is used.  Otherwise, it\noverrides the normal algorithm (and the outcome is cached).\n'
        return False

    @property
    def exc(self):
        'exc: object'
        pass

    @property
    def func(self):
        'func: object'
        pass

    @property
    def handler(self):
        'handler: object'
        pass


def flip(func, a, b):
    "flip(func, a, b)\n\n    Call the function call with the arguments flipped\n\n    This function is curried.\n\n    >>> def div(a, b):\n    ...     return a // b\n    ...\n    >>> flip(div, 2, 6)\n    3\n    >>> div_by_two = flip(div, 2)\n    >>> div_by_two(4)\n    2\n\n    This is particularly useful for built in functions and functions defined\n    in C extensions that accept positional only arguments. For example:\n    isinstance, issubclass.\n\n    >>> data = [1, 'a', 'b', 2, 1.5, object(), 3]\n    >>> only_ints = list(filter(flip(isinstance, int), data))\n    >>> only_ints\n    [1, 2, 3]\n    "
    pass

def has_keywords(func, sigspec):
    " Does a function have keyword arguments?\n\n    This function relies on introspection and does not call the function.\n    Returns None if validity can't be determined.\n\n    >>> def f(x, y=0):\n    ...     return x + y\n\n    >>> has_keywords(f)\n    True\n    "
    pass

def has_varargs(func, sigspec):
    " Does a function have variadic positional arguments?\n\n    This function relies on introspection and does not call the function.\n    Returns None if validity can't be determined.\n\n    >>> def f(*args):\n    ...    return args\n    >>> has_varargs(f)\n    True\n    >>> def g(**kwargs):\n    ...    return kwargs\n    >>> has_varargs(g)\n    False\n    "
    pass

def identity(x):
    'identity(x)'
    pass

ifilter = _mod_builtins.filter
imap = _mod_builtins.map
def import_module(name, package):
    "Import a module.\n\n    The 'package' argument is required when performing a relative import. It\n    specifies the package to use as the anchor point from which to resolve the\n    relative import to an absolute import.\n\n    "
    pass

def instanceproperty(fget, fset, fdel, doc, classval):
    " Like @property, but returns ``classval`` when used as a class attribute\n\n    >>> class MyClass(object):\n    ...     '''The class docstring'''\n    ...     @instanceproperty(classval=__doc__)\n    ...     def __doc__(self):\n    ...         return 'An object docstring'\n    ...     @instanceproperty\n    ...     def val(self):\n    ...         return 42\n    ...\n    >>> MyClass.__doc__\n    'The class docstring'\n    >>> MyClass.val is None\n    True\n    >>> obj = MyClass()\n    >>> obj.__doc__\n    'An object docstring'\n    >>> obj.val\n    42\n    "
    pass

def is_arity(n, func, sigspec):
    " Does a function have only n positional arguments?\n\n    This function relies on introspection and does not call the function.\n    Returns None if validity can't be determined.\n\n    >>> def f(x):\n    ...     return x\n    >>> is_arity(1, f)\n    True\n    >>> def g(x, y=1):\n    ...     return x + y\n    >>> is_arity(1, g)\n    False\n    "
    pass

def is_partial_args(func, args, kwargs, sigspec):
    " Can partial(func, *args, **kwargs)(*args2, **kwargs2) be a valid call?\n\n    Returns True *only* if the call is valid or if it is possible for the\n    call to become valid by adding more positional or keyword arguments.\n\n    This function relies on introspection and does not call the function.\n    Returns None if validity can't be determined.\n\n    >>> def add(x, y):\n    ...     return x + y\n\n    >>> is_partial_args(add, (1,), {})\n    True\n    >>> is_partial_args(add, (1, 2), {})\n    True\n    >>> is_partial_args(add, (1, 2, 3), {})\n    False\n    >>> is_partial_args(map, (), {})\n    True\n\n    **Implementation notes**\n    Python 2 relies on ``inspect.getargspec``, which only works for\n    user-defined functions.  Python 3 uses ``inspect.signature``, which\n    works for many more types of callables.\n\n    Many builtins in the standard library are also supported.\n    "
    pass

def is_valid_args(func, args, kwargs, sigspec):
    " Is ``func(*args, **kwargs)`` a valid function call?\n\n    This function relies on introspection and does not call the function.\n    Returns None if validity can't be determined.\n\n    >>> def add(x, y):\n    ...     return x + y\n\n    >>> is_valid_args(add, (1,), {})\n    False\n    >>> is_valid_args(add, (1, 2), {})\n    True\n    >>> is_valid_args(map, (), {})\n    False\n\n    **Implementation notes**\n    Python 2 relies on ``inspect.getargspec``, which only works for\n    user-defined functions.  Python 3 uses ``inspect.signature``, which\n    works for many more types of callables.\n\n    Many builtins in the standard library are also supported.\n    "
    pass

def juxt(*funcs):
    'juxt(*funcs)\n\n    Creates a function that calls several functions with the same arguments\n\n    Takes several functions and returns a function that applies its arguments\n    to each of those functions then returns a tuple of the results.\n\n    Name comes from juxtaposition: the fact of two things being seen or placed\n    close together with contrasting effect.\n\n    >>> inc = lambda x: x + 1\n    >>> double = lambda x: x * 2\n    >>> juxt(inc, double)(10)\n    (11, 20)\n    >>> juxt([inc, double])(10)\n    (11, 20)\n    '
    pass

def memoize(func, cache, key):
    "memoize(func, cache=None, key=None)\n\n    Cache a function's result for speedy future evaluation\n\n    Considerations:\n        Trades memory for speed.\n        Only use on pure functions.\n\n    >>> def add(x, y):  return x + y\n    >>> add = memoize(add)\n\n    Or use as a decorator\n\n    >>> @memoize\n    ... def add(x, y):\n    ...     return x + y\n\n    Use the ``cache`` keyword to provide a dict-like object as an initial cache\n\n    >>> @memoize(cache={(1, 2): 3})\n    ... def add(x, y):\n    ...     return x + y\n\n    Note that the above works as a decorator because ``memoize`` is curried.\n\n    It is also possible to provide a ``key(args, kwargs)`` function that\n    calculates keys used for the cache, which receives an ``args`` tuple and\n    ``kwargs`` dict as input, and must return a hashable value.  However,\n    the default key function should be sufficient most of the time.\n\n    >>> # Use key function that ignores extraneous keyword arguments\n    >>> @memoize(key=lambda args, kwargs: args)\n    ... def add(x, y, verbose=False):\n    ...     if verbose:\n    ...         print('Calculating %s + %s' % (x, y))\n    ...     return x + y\n    "
    pass

no_default = '__no__default__'
def num_required_args(func, sigspec):
    " Number of required positional arguments\n\n    This function relies on introspection and does not call the function.\n    Returns None if validity can't be determined.\n\n    >>> def f(x, y, z=3):\n    ...     return x + y + z\n    >>> num_required_args(f)\n    2\n    >>> def g(*args, **kwargs):\n    ...     pass\n    >>> num_required_args(g)\n    0\n    "
    pass

partial = _mod_functools.partial
def pipe(data, *funcs):
    "pipe(data, *funcs)\n\n    Pipe a value through a sequence of functions\n\n    I.e. ``pipe(data, f, g, h)`` is equivalent to ``h(g(f(data)))``\n\n    We think of the value as progressing through a pipe of several\n    transformations, much like pipes in UNIX\n\n    ``$ cat data | f | g | h``\n\n    >>> double = lambda i: 2 * i\n    >>> pipe(3, double, str)\n    '6'\n\n    See Also:\n        compose\n        thread_first\n        thread_last\n    "
    pass

def reduce(function, sequence, initial=None):
    'reduce(function, sequence[, initial]) -> value\n\nApply a function of two arguments cumulatively to the items of a sequence,\nfrom left to right, so as to reduce the sequence to a single value.\nFor example, reduce(lambda x, y: x+y, [1, 2, 3, 4, 5]) calculates\n((((1+2)+3)+4)+5).  If initial is present, it is placed before the items\nof the sequence in the calculation, and serves as a default when the\nsequence is empty.'
    pass

def return_none(exc):
    'return_none(exc)\n\n    Returns None.\n    '
    pass

def thread_first(val, *forms):
    'thread_first(val, *forms)\n\n    Thread value through a sequence of functions/forms\n\n    >>> def double(x): return 2*x\n    >>> def inc(x):    return x + 1\n    >>> thread_first(1, inc, double)\n    4\n\n    If the function expects more than one input you can specify those inputs\n    in a tuple.  The value is used as the first input.\n\n    >>> def add(x, y): return x + y\n    >>> def pow(x, y): return x**y\n    >>> thread_first(1, (add, 4), (pow, 2))  # pow(add(1, 4), 2)\n    25\n\n    So in general\n        thread_first(x, f, (g, y, z))\n    expands to\n        g(f(x), y, z)\n\n    See Also:\n        thread_last\n    '
    pass

def thread_last(val, *forms):
    'thread_last(val, *forms)\n\n    Thread value through a sequence of functions/forms\n\n    >>> def double(x): return 2*x\n    >>> def inc(x):    return x + 1\n    >>> thread_last(1, inc, double)\n    4\n\n    If the function expects more than one input you can specify those inputs\n    in a tuple.  The value is used as the last input.\n\n    >>> def add(x, y): return x + y\n    >>> def pow(x, y): return x**y\n    >>> thread_last(1, (add, 4), (pow, 2))  # pow(2, add(4, 1))\n    32\n\n    So in general\n        thread_last(x, f, (g, y, z))\n    expands to\n        g(y, z, f(x))\n\n    >>> def iseven(x):\n    ...     return x % 2 == 0\n    >>> list(thread_last([1, 2, 3], (map, inc), (filter, iseven)))\n    [2, 4]\n\n    See Also:\n        thread_first\n    '
    pass

