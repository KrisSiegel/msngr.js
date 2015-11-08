# Contributing
To contribute to msngr.js there are a few rules I expect every developer to follow to ensure the best quality library possible. There are no "zero-tolerance" rules because, well, those are dumb in almost every single case in existence (I'm sure someone will find a reason where my rules should be ignored).

The goal of this short document isn't to be annoying but to ensure quality. I will work with anyone who wishes to submit a pull request.

## Checklists
The checklists should serve as a guide for submitting your pull request.

### Bug fixing
When fixing a bug these apply:

- A unit test *must* be included that cover the bug to ensure proper regression testing during future updates.
- If an API change is required to fix a bug the API change cannot break current compatibility. Should it break compatibility then a discussion should happen regarding necessary semantic versioning prior to acceptance.

### Feature changes and additions
The following should be done when changing or adding features:

- Ensure proper discussion is done within GitHub issues to ensure it will be accepted (naturally forks are not a problem; if it's not desired to put into msngr.js's main repository then feel free to keep the fork!).
- All API compatibility breaks must have a new major version number.
- All documentation [and accompanying unit tests] must be updated to comply with the new changes.
- All unit tests must pass when run against node, phantomjs, Internet Explorer 10+, Firefox and Chrome browsers in their expanded and minified versions.

## Have fun!
Writing msngr.js has been a treat for me as it personally solves multiple issues for me. I'm not sure if it will be the same for anyone else or not but I hope others will find it useful and if so will help me in continuing to make it better!
