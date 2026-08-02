"""Runtime configuration. Every value is overridable with an IV_ env var."""

from functools import cached_property
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="IV_", env_file=".env", extra="ignore")

    # The git-backed content repo. Mounted read-write here, read-only in nginx.
    content_dir: Path = Path("/data/content")
    # Submissions and the user store. Never inside the content repo: it is
    # pushed to a backup remote and this holds personal data and password hashes.
    app_data_dir: Path = Path("/data/app")
    auth_dir: Path = Path("/data/auth")

    # Must be overridden in production; startup refuses to serve the default.
    jwt_secret: str = "change-me"
    jwt_ttl_hours: int = 8
    # Off only for local http development.
    cookie_secure: bool = True

    # Optional private remote for off-site content backup.
    backup_remote: str = ""

    max_upload_bytes: int = 5 * 1024 * 1024
    max_image_edge: int = 1600
    # Belt to nginx's braces: a second per-IP ceiling on public submissions.
    submissions_per_ip_per_hour: int = 10
    # Soft-deleted submissions are purged after this many days.
    trash_retention_days: int = 30

    @cached_property
    def pages_dir(self) -> Path:
        return self.content_dir / "pages"

    @cached_property
    def media_dir(self) -> Path:
        return self.content_dir / "media"

    @cached_property
    def dist_file(self) -> Path:
        """The merged payload nginx serves; regenerated on every save."""
        return self.content_dir / "dist" / "content.json"

    @cached_property
    def lock_file(self) -> Path:
        return self.content_dir / ".write.lock"

    @cached_property
    def users_file(self) -> Path:
        return self.auth_dir / "users.json"

    @cached_property
    def db_file(self) -> Path:
        return self.app_data_dir / "submissions.db"

    @cached_property
    def schema_file(self) -> Path:
        return Path(__file__).parent / "schema" / "site_schema.json"


settings = Settings()
