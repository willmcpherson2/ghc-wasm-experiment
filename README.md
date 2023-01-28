Small experiment using the new WASM capabilities of GHC.

```shell
nix run .#update
nix run .#build
python -m http.server --directory dist
```

The app just reads keyboard events (JavaScript), appends exclamation
marks to them (Haskell), and prints them to the console (JavaScript).

https://gitlab.haskell.org/ghc/ghc-wasm-meta

https://github.com/tweag/ormolu/tree/master/ormolu-live
