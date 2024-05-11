#!/usr/bin/env bash
set -eu

NAME="nft_trader"
CODE="../../"
DIR="${DIR:=./deployments}" # Output directory for build files

# Copy command helper (cross-platform)
CP_CMD=$(command -v cp &> /dev/null && echo "cp" || echo "copy")

echo -e "\nBuilding NftTrader…"
cargo contract build --release --quiet --manifest-path $CODE/Cargo.toml

echo "Copying build files to '$DIR/$NAME/'…"
mkdir -p $DIR/$NAME
$CP_CMD $CODE/target/ink/$NAME.contract $DIR/$NAME/
$CP_CMD $CODE/target/ink/$NAME.wasm $DIR/$NAME/
$CP_CMD $CODE/target/ink/$NAME.json $DIR/$NAME/

if [[ "$@" != *"--skip-types"* ]]; then
  echo "Generate types via typechain into './typed-contracts'…"
  # Because of an open issue, this used the npx-installed version of `@727-ventures/typechain-polkadot`
  # See: https://github.com/Brushfam/typechain-polkadot/issues/115
  npx @727-ventures/typechain-polkadot --in $DIR/$NAME/ --out typed-contracts --yes
fi
