{
  description = "João Pedro's portfolio website and showcase";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    tools = {
      url = "github:jaoppb/tools/v0.1.0";
      inputs.nixpkgs.follows = "nixpkgs";
      inputs.flake-utils.follows = "flake-utils";
    };
  };

  outputs = { self, nixpkgs, flake-utils, tools }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        toolsPkgs = tools.packages.${system};
      in {
        devShells.default = pkgs.mkShell {
          packages = [
            pkgs.just
            pkgs.gh
            toolsPkgs.issues-check
            toolsPkgs.project-sync
            toolsPkgs.repo-sync
          ];
        };
      }
    );
}
