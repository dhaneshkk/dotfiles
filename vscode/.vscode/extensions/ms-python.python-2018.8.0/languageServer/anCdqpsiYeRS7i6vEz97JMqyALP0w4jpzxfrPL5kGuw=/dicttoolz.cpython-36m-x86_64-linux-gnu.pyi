import builtins as _mod_builtins

__all__ = _mod_builtins.list()
__builtins__ = {}
__doc__ = None
__file__ = '/home/dhanesh/anaconda3/envs/spacy/lib/python3.6/site-packages/cytoolz/dicttoolz.cpython-36m-x86_64-linux-gnu.so'
__name__ = 'cytoolz.dicttoolz'
__package__ = 'cytoolz'
__pyx_capi__ = _mod_builtins.dict()
__test__ = _mod_builtins.dict()
def assoc(d, key, value, factory):
    "assoc(d, key, value, factory=dict)\n\n    Return a new dict with new key value pair\n\n    New dict has d[key] set to value. Does not modify the initial dictionary.\n\n    >>> assoc({'x': 1}, 'x', 2)\n    {'x': 2}\n    >>> assoc({'x': 1}, 'y', 3)   # doctest: +SKIP\n    {'x': 1, 'y': 3}\n    "
    pass

def assoc_in(d, keys, value, factory):
    "assoc_in(d, keys, value, factory=dict)\n\n    Return a new dict with new, potentially nested, key value pair\n\n    >>> purchase = {'name': 'Alice',\n    ...             'order': {'items': ['Apple', 'Orange'],\n    ...                       'costs': [0.50, 1.25]},\n    ...             'credit card': '5555-1234-1234-1234'}\n    >>> assoc_in(purchase, ['order', 'costs'], [0.25, 1.00]) # doctest: +SKIP\n    {'credit card': '5555-1234-1234-1234',\n     'name': 'Alice',\n     'order': {'costs': [0.25, 1.00], 'items': ['Apple', 'Orange']}}\n    "
    pass

def copy(x):
    "Shallow copy operation on arbitrary Python objects.\n\n    See the module's __doc__ string for more info.\n    "
    pass

def dissoc(d, *keys):
    "dissoc(d, *keys)\n\n    Return a new dict with the given key(s) removed.\n\n    New dict has d[key] deleted for each supplied key.\n    Does not modify the initial dictionary.\n\n    >>> dissoc({'x': 1, 'y': 2}, 'y')\n    {'x': 1}\n    >>> dissoc({'x': 1, 'y': 2}, 'y', 'x')\n    {}\n    >>> dissoc({'x': 1}, 'y') # Ignores missing keys\n    {'x': 1}\n    "
    pass

def get_in(keys, coll, default, no_default):
    "get_in(keys, coll, default=None, no_default=False)\n\n    Returns coll[i0][i1]...[iX] where [i0, i1, ..., iX]==keys.\n\n    If coll[i0][i1]...[iX] cannot be found, returns ``default``, unless\n    ``no_default`` is specified, then it raises KeyError or IndexError.\n\n    ``get_in`` is a generalization of ``operator.getitem`` for nested data\n    structures such as dictionaries and lists.\n\n    >>> transaction = {'name': 'Alice',\n    ...                'purchase': {'items': ['Apple', 'Orange'],\n    ...                             'costs': [0.50, 1.25]},\n    ...                'credit card': '5555-1234-1234-1234'}\n    >>> get_in(['purchase', 'items', 0], transaction)\n    'Apple'\n    >>> get_in(['name'], transaction)\n    'Alice'\n    >>> get_in(['purchase', 'total'], transaction)\n    >>> get_in(['purchase', 'items', 'apple'], transaction)\n    >>> get_in(['purchase', 'items', 10], transaction)\n    >>> get_in(['purchase', 'total'], transaction, 0)\n    0\n    >>> get_in(['y'], {}, no_default=True)\n    Traceback (most recent call last):\n        ...\n    KeyError: 'y'\n\n    See Also:\n        itertoolz.get\n        operator.getitem\n    "
    pass

def itemfilter(predicate, d, factory):
    'itemfilter(predicate, d, factory=dict)\n\n    Filter items in dictionary by item\n\n    >>> def isvalid(item):\n    ...     k, v = item\n    ...     return k % 2 == 0 and v < 4\n\n    >>> d = {1: 2, 2: 3, 3: 4, 4: 5}\n    >>> itemfilter(isvalid, d)\n    {2: 3}\n\n    See Also:\n        keyfilter\n        valfilter\n        itemmap\n    '
    pass

def itemmap(func, d, factory):
    'itemmap(func, d, factory=dict)\n\n    Apply function to items of dictionary\n\n    >>> accountids = {"Alice": 10, "Bob": 20}\n    >>> itemmap(reversed, accountids)  # doctest: +SKIP\n    {10: "Alice", 20: "Bob"}\n\n    See Also:\n        keymap\n        valmap\n    '
    pass

def keyfilter(predicate, d, factory):
    'keyfilter(predicate, d, factory=dict)\n\n    Filter items in dictionary by key\n\n    >>> iseven = lambda x: x % 2 == 0\n    >>> d = {1: 2, 2: 3, 3: 4, 4: 5}\n    >>> keyfilter(iseven, d)\n    {2: 3, 4: 5}\n\n    See Also:\n        valfilter\n        itemfilter\n        keymap\n    '
    pass

def keymap(func, d, factory):
    'keymap(func, d, factory=dict)\n\n    Apply function to keys of dictionary\n\n    >>> bills = {"Alice": [20, 15, 30], "Bob": [10, 35]}\n    >>> keymap(str.lower, bills)  # doctest: +SKIP\n    {\'alice\': [20, 15, 30], \'bob\': [10, 35]}\n\n    See Also:\n        valmap\n        itemmap\n    '
    pass

def merge(*dicts, **kwargs):
    "merge(*dicts, **kwargs)\n\n    Merge a collection of dictionaries\n\n    >>> merge({1: 'one'}, {2: 'two'})\n    {1: 'one', 2: 'two'}\n\n    Later dictionaries have precedence\n\n    >>> merge({1: 2, 3: 4}, {3: 3, 4: 4})\n    {1: 2, 3: 3, 4: 4}\n\n    See Also:\n        merge_with\n    "
    pass

def merge_with(func, *dicts, **kwargs):
    'merge_with(func, *dicts, **kwargs)\n\n    Merge dictionaries and apply function to combined values\n\n    A key may occur in more than one dict, and all values mapped from the key\n    will be passed to the function as a list, such as func([val1, val2, ...]).\n\n    >>> merge_with(sum, {1: 1, 2: 2}, {1: 10, 2: 20})\n    {1: 11, 2: 22}\n\n    >>> merge_with(first, {1: 1, 2: 2}, {2: 20, 3: 30})  # doctest: +SKIP\n    {1: 1, 2: 2, 3: 30}\n\n    See Also:\n        merge\n    '
    pass

def update_in(d, keys, func, default, factory):
    'update_in(d, keys, func, default=None, factory=dict)\n\n    Update value in a (potentially) nested dictionary\n\n    inputs:\n    d - dictionary on which to operate\n    keys - list or tuple giving the location of the value to be changed in d\n    func - function to operate on that value\n\n    If keys == [k0,..,kX] and d[k0]..[kX] == v, update_in returns a copy of the\n    original dictionary with v replaced by func(v), but does not mutate the\n    original dictionary.\n\n    If k0 is not a key in d, update_in creates nested dictionaries to the depth\n    specified by the keys, with the innermost value set to func(default).\n\n    >>> inc = lambda x: x + 1\n    >>> update_in({\'a\': 0}, [\'a\'], inc)\n    {\'a\': 1}\n\n    >>> transaction = {\'name\': \'Alice\',\n    ...                \'purchase\': {\'items\': [\'Apple\', \'Orange\'],\n    ...                             \'costs\': [0.50, 1.25]},\n    ...                \'credit card\': \'5555-1234-1234-1234\'}\n    >>> update_in(transaction, [\'purchase\', \'costs\'], sum) # doctest: +SKIP\n    {\'credit card\': \'5555-1234-1234-1234\',\n     \'name\': \'Alice\',\n     \'purchase\': {\'costs\': 1.75, \'items\': [\'Apple\', \'Orange\']}}\n\n    >>> # updating a value when k0 is not in d\n    >>> update_in({}, [1, 2, 3], str, default="bar")\n    {1: {2: {3: \'bar\'}}}\n    >>> update_in({1: \'foo\'}, [2, 3, 4], inc, 0)\n    {1: \'foo\', 2: {3: {4: 1}}}\n    '
    pass

def valfilter(predicate, d, factory):
    'valfilter(predicate, d, factory=dict)\n\n    Filter items in dictionary by value\n\n    >>> iseven = lambda x: x % 2 == 0\n    >>> d = {1: 2, 2: 3, 3: 4, 4: 5}\n    >>> valfilter(iseven, d)\n    {1: 2, 3: 4}\n\n    See Also:\n        keyfilter\n        itemfilter\n        valmap\n    '
    pass

def valmap(func, d, factory):
    'valmap(func, d, factory=dict)\n\n    Apply function to values of dictionary\n\n    >>> bills = {"Alice": [20, 15, 30], "Bob": [10, 35]}\n    >>> valmap(sum, bills)  # doctest: +SKIP\n    {\'Alice\': 65, \'Bob\': 45}\n\n    See Also:\n        keymap\n        itemmap\n    '
    pass

