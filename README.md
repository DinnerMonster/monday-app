# Monday -> GitHub App
## Version 1.0

The purpose of this app:
- Reduce the amount of monday.com license by allowing hubbers (or anyone with a github account) to see real time updates and posts from monday.com
- Allow for seemless project management between the two platforms.

### Functionality specifics
- The app is a one way pipeline from Monday.com to GitHub.com triggered from Monday.com webhooks.
- Instead of using a database inside the node server, the IDs of the monday items are stored in the body of the created issue.
- Updates are posted by parsing through issues and posting to the issue with the associated **item ID**.
- Authentication is built around subscription ID.


### In progress
- Javascript Classes for an easy configuration scheme.
- Pre-existing item importer. (Currently only posts new items to GitHub.com)
- Item name updater either via column update or new webhook. (Currently all items created with *New Item* button are stuck with name 'New Item'. Monday.com is currently working to fix this)
