# Editing the IV website

A short guide to the content editor. You don't need to know anything technical
to use it — if something here doesn't match what you see, ask before changing
it rather than guessing.

## Signing in

Go to **https://your-domain.com/admin** and sign in with the email address and
password you were given. You'll stay signed in for eight hours.

If you forget your password, ask your developer to reset it — there's no
"forgot password" email.

## What you can change

**Text and images.** Every headline, paragraph, statistic, caption, and photo
on the site.

**What you can't change:** the layout, the order of sections, the number of
items in a grid, or the pages themselves. Those are fixed in the design on
purpose, so the site can't be accidentally broken. If you need one of them
changed, ask your developer — most are a small job.

## Making a change

1. Pick a page from the left-hand list.
2. Edit the fields. They're grouped in the same order they appear on the page.
3. Click **Save**.

The change is live within a second or two. Just refresh the public site to see
it. Nothing needs to be rebuilt or redeployed.

**Save is publish.** There is no draft state — what you save is what visitors
see. If you want to work on wording privately, draft it somewhere else first.

## Headings with gold and italic text

Headings on this site mix three styles. You don't type any special characters —
select the words you want to style and click a button above the field:

| Button | Effect |
|---|---|
| *I* | Italic |
| **A** (gold) | Gold |
| ***A*** (gold italic) | Gold and italic |
| **.** | Toggles the large gold full stop at the end |

Underneath each heading field there's a **Preview** showing exactly how it will
look on the site. Trust the preview — if it looks right there, it's right.

You may see `*` or `\` characters in the text box. Those are the style markers.
Leave them alone unless you're using the buttons; deleting one just removes the
styling.

## Replacing an image

1. Click **Replace** under the image.
2. Either pick an existing image from the library, or click **Upload**.
3. Choose your file. It's resized automatically, so a photo straight off a
   phone is fine.

Use **JPG, PNG, or WebP**. Landscape photos work best in most slots — check the
shape of the image you're replacing and use something similar, or it will be
cropped.

Uploading doesn't delete the old image; it stays in the library in case you
want it back.

## Undoing a change

Click **History** at the top of any page. You'll see who changed it and when.
Click **Restore** next to an earlier version to bring it back.

Restoring is itself recorded, so you can always undo an undo. Nothing is ever
really lost.

## Messages

Every enquiry from the website — the contact form, proposal requests, and
factory tour bookings — arrives in **Messages**.

**There is no email notification.** The number next to "Messages" in the
sidebar is the only signal that something new has come in, so check it daily.

- Click a message to read it. Opening it marks it as read.
- **Email** and **WhatsApp** buttons open a reply directly.
- **Mark handled** once you've dealt with it, so you can tell at a glance
  what's outstanding.
- **Delete** moves it to **Trash**, where it stays for 30 days before being
  removed for good. If you delete something by mistake, open Trash and restore
  it.
- **Export CSV** downloads everything for a spreadsheet.

Messages contain customers' names, emails and phone numbers. Treat the export
file accordingly.

## If something goes wrong

**"3 field(s) need attention"** — a required field is empty, or text is too
long. The problem fields are marked in red with the reason.

**The Save button is greyed out** — you haven't changed anything yet.

**You can't sign in** — check the address is exactly `/admin`. After several
wrong passwords the server will slow you down for a minute; wait and try again.

**The site looks broken after an edit** — open History on that page and restore
the previous version. Then tell your developer what you changed.
