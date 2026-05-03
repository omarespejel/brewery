# START HERE

Brewery is a separate maintenance-control-plane repo for Pathfinder, Scarb, and
Mezcal maintenance.

Read these files first:

1. `README.md`
2. `docs/operating-model.md`
3. `sources/*.yaml`
4. `src/classifier/rules.js`

Current phase: watch-only MVP.

Allowed now:

- collect upstream signals
- classify severity and confidence
- render digests
- create or update Linear issues after explicit connector setup

Not allowed yet:

- auto-merge
- auto-deploy
- external auto-replies
- PR workers without a human-reviewed Linear label and approval gate

Validation:

```bash
npm test
npm run classify:sample
```
