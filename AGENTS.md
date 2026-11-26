<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules

- Shopper-facing copy is Spanish; code, comments and identifiers stay English. Why: the store targets Chile while the codebase stays conventional.
- Catalog, orders and customers come from `src/lib/catalog.ts` and `src/lib/demo-data.ts` until the backend replaces them; pages read through the helpers there, never hardcode products. Why: one swap point when real data arrives.
- Bag state lives in `CartProvider` (`src/lib/cart.tsx`); totals come only from `cartTotals`. Why: one source of truth for money shown to shoppers.
- Actions that need the backend (auth, forms, payment) call `notConnected()` instead of faking success. Why: never show a result that did not happen.
- Styling uses tokens and `@utility` classes (`btn`, `field`, `eyebrow`, `page`) from `src/styles.css`; no raw colour classes in components. Why: keeps the brand consistent.
- Route files export only `Route`; shared UI lives in `src/components`. Why: route code-splitting breaks on extra exports.
