"""
Request models for the public submission endpoint.

Three form shapes reach one inbox: the contact form (which appears both on the
home page and the contact page), a proposal request, and a factory tour
booking. Name, email and phone are promoted out of the per-kind payload so the
inbox can list and search without unpacking JSON.

Every field is capped. This is the only unauthenticated write on the system.
"""

from __future__ import annotations

from typing import Annotated, Literal, Union

from pydantic import BaseModel, ConfigDict, Field, field_validator

# Deliberately permissive — enough to reject junk, not to arbitrate RFC 5322.
EMAIL_RE = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"

Name = Annotated[str, Field(min_length=1, max_length=120)]
Email = Annotated[str, Field(min_length=3, max_length=254, pattern=EMAIL_RE)]
Phone = Annotated[str, Field(default="", max_length=40)]
Short = Annotated[str, Field(default="", max_length=160)]
Long = Annotated[str, Field(default="", max_length=5000)]


class BaseSubmission(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    name: Name
    email: Email
    phone: Phone = ""

    # Anti-spam, never stored. `website` is the honeypot: hidden from people,
    # irresistible to bots. `elapsed_ms` is how long the form was on screen.
    website: str = Field(default="", max_length=200)
    elapsed_ms: int = Field(default=0, ge=0)

    @field_validator("name", "email")
    @classmethod
    def not_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("must not be blank")
        return v


class ContactSubmission(BaseSubmission):
    kind: Literal["contact"]
    company: Short = ""
    interest: Short = ""
    message: Long = ""


class ProposalSubmission(BaseSubmission):
    kind: Literal["proposal"]
    project_type: Short = ""
    size: Short = ""
    timeframe: Short = ""
    details: Long = ""


class TourSubmission(BaseSubmission):
    kind: Literal["tour"]
    project_type: Short = ""
    tour_date: Short = ""
    tour_time: Short = ""
    details: Long = ""


Submission = Annotated[
    Union[ContactSubmission, ProposalSubmission, TourSubmission],
    Field(discriminator="kind"),
]

# Fields that are columns, plus the two anti-spam ones — everything else on the
# model belongs in the JSON payload.
NON_PAYLOAD = {"kind", "name", "email", "phone", "website", "elapsed_ms"}


def payload_of(submission: BaseSubmission) -> dict:
    return {k: v for k, v in submission.model_dump().items() if k not in NON_PAYLOAD}


class StatusUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    status: Literal["unread", "read", "handled"]


class LoginRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    email: Annotated[str, Field(max_length=254)]
    password: Annotated[str, Field(min_length=1, max_length=200)]


class RestoreRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    sha: Annotated[str, Field(min_length=7, max_length=40, pattern=r"^[0-9a-f]+$")]
