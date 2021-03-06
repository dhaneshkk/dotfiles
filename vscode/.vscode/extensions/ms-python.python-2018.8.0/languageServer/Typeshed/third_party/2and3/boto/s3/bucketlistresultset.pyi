from .bucket import Bucket
from .key import Key

from typing import Any, Iterable, Iterator, Optional

def bucket_lister(bucket, prefix: str = ..., delimiter: str = ..., marker: str = ..., headers: Optional[Any] = ..., encoding_type: Optional[Any] = ...): ...

class BucketListResultSet(Iterable[Key]):
    bucket = ...  # type: Any
    prefix = ...  # type: Any
    delimiter = ...  # type: Any
    marker = ...  # type: Any
    headers = ...  # type: Any
    encoding_type = ...  # type: Any
    def __init__(self, bucket: Optional[Any] = ..., prefix: str = ..., delimiter: str = ..., marker: str = ..., headers: Optional[Any] = ..., encoding_type: Optional[Any] = ...) -> None: ...
    def __iter__(self) -> Iterator[Key]: ...

def versioned_bucket_lister(bucket, prefix: str = ..., delimiter: str = ..., key_marker: str = ..., version_id_marker: str = ..., headers: Optional[Any] = ..., encoding_type: Optional[Any] = ...): ...

class VersionedBucketListResultSet:
    bucket = ...  # type: Any
    prefix = ...  # type: Any
    delimiter = ...  # type: Any
    key_marker = ...  # type: Any
    version_id_marker = ...  # type: Any
    headers = ...  # type: Any
    encoding_type = ...  # type: Any
    def __init__(self, bucket: Optional[Any] = ..., prefix: str = ..., delimiter: str = ..., key_marker: str = ..., version_id_marker: str = ..., headers: Optional[Any] = ..., encoding_type: Optional[Any] = ...) -> None: ...
    def __iter__(self) -> Iterator[Key]: ...

def multipart_upload_lister(bucket, key_marker: str = ..., upload_id_marker: str = ..., headers: Optional[Any] = ..., encoding_type: Optional[Any] = ...): ...

class MultiPartUploadListResultSet:
    bucket = ...  # type: Any
    key_marker = ...  # type: Any
    upload_id_marker = ...  # type: Any
    headers = ...  # type: Any
    encoding_type = ...  # type: Any
    def __init__(self, bucket: Optional[Any] = ..., key_marker: str = ..., upload_id_marker: str = ..., headers: Optional[Any] = ..., encoding_type: Optional[Any] = ...) -> None: ...
    def __iter__(self): ...
