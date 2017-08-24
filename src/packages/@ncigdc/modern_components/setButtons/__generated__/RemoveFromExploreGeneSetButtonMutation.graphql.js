/**
 * This file was generated by:
 *   relay-compiler
 *
 * @providesModule RemoveFromExploreGeneSetButtonMutation.graphql
 * @generated SignedSource<<851eed7c4300d194349877ae4b46e3b6>>
 * @relayHash 5a2ef8283ecae40370770c150df87dc5
 * @flow
 * @nogrep
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type RelayIsDumb = {
  relay_is_dumb?: ?any;
};

export type RemoveFromExploreGeneSetButtonMutationResponse = {
  remove_from?: ?RemoveFromExploreGeneSetButtonMutationResponse_remove_from;
};

export type RemoveFromExploreGeneSetButtonMutationResponse_remove_from_explore_gene = {
  set_id?: ?string;
};

export type RemoveFromExploreGeneSetButtonMutationResponse_remove_from_explore = {
  gene?: ?RemoveFromExploreGeneSetButtonMutationResponse_remove_from_explore_gene;
};

export type RemoveFromExploreGeneSetButtonMutationResponse_remove_from = {
  explore?: ?RemoveFromExploreGeneSetButtonMutationResponse_remove_from_explore;
};
*/


/*
mutation RemoveFromExploreGeneSetButtonMutation(
  $input: RemoveFromSetInput
  $never_used: RelayIsDumb
) {
  sets(input: $never_used) {
    remove_from {
      explore {
        gene(input: $input) {
          set_id
        }
      }
    }
  }
}
*/

const batch /*: ConcreteBatch*/ = {
  "fragment": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "input",
        "type": "RemoveFromSetInput",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "never_used",
        "type": "RelayIsDumb",
        "defaultValue": null
      }
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "RemoveFromExploreGeneSetButtonMutation",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "input",
            "variableName": "never_used",
            "type": "RelayIsDumb"
          }
        ],
        "concreteType": "Sets",
        "name": "sets",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "RemoveFromSet",
            "name": "remove_from",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "args": null,
                "concreteType": "RemoveFromExploreSet",
                "name": "explore",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "args": [
                      {
                        "kind": "Variable",
                        "name": "input",
                        "variableName": "input",
                        "type": "RemoveFromSetInput"
                      }
                    ],
                    "concreteType": "RemoveFromGeneSet",
                    "name": "gene",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "set_id",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation"
  },
  "id": null,
  "kind": "Batch",
  "metadata": {},
  "name": "RemoveFromExploreGeneSetButtonMutation",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "input",
        "type": "RemoveFromSetInput",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "never_used",
        "type": "RelayIsDumb",
        "defaultValue": null
      }
    ],
    "kind": "Root",
    "name": "RemoveFromExploreGeneSetButtonMutation",
    "operation": "mutation",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "input",
            "variableName": "never_used",
            "type": "RelayIsDumb"
          }
        ],
        "concreteType": "Sets",
        "name": "sets",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "RemoveFromSet",
            "name": "remove_from",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "args": null,
                "concreteType": "RemoveFromExploreSet",
                "name": "explore",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "args": [
                      {
                        "kind": "Variable",
                        "name": "input",
                        "variableName": "input",
                        "type": "RemoveFromSetInput"
                      }
                    ],
                    "concreteType": "RemoveFromGeneSet",
                    "name": "gene",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "set_id",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "text": "mutation RemoveFromExploreGeneSetButtonMutation(\n  $input: RemoveFromSetInput\n  $never_used: RelayIsDumb\n) {\n  sets(input: $never_used) {\n    remove_from {\n      explore {\n        gene(input: $input) {\n          set_id\n        }\n      }\n    }\n  }\n}\n"
};

module.exports = batch;
