{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
  flake-utils.lib.eachDefaultSystem (system:
    let pkgs = import nixpkgs { inherit system; }; in {
      devShells.default = pkgs.mkShell {
        buildInputs = with pkgs; [
          nodejs_22
          nodePackages.typescript-language-server
          pocketbase
          (pkgs.writeShellScriptBin "run" ''
            BACKEND_URL=http://localhost:8090 npm run dev&
            pocketbase serve
          '')
        ];
      };
    }
  );
}
