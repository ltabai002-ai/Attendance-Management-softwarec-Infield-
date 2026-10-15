<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the INFIELD experience as one anchored scrolling landing page because its scene-by-scene narrative and navigation are explicitly sequential.
- Build interface illustrations with semantic HTML/CSS and Lucide icons so every product screen remains responsive and readable without external imagery.
- Keep root shell and boundary JSX in src/components/root-layout.tsx, with a JSX-free root route and getRouteApi for context, to avoid production route-parser failures and circular route imports.
- Ad tags (Meta Pixel) must load only through the consent gate in src/lib/consent.ts — default-denied in the head script, granted by region lookup or recorded choice — so consent-required regions never receive ungated signals.
