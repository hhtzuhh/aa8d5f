04/25/2025

# react flow website
https://reactflow.dev/



# mock server
need to download the mock server
in /frontendchallengeserver
```
curl --request GET \                                                                                ⏱ 
  --url http://localhost:3000/api/v1/123/actions/blueprints/bp_456/graph \
  --header 'Accept: application/json, application/problem+json'
```



# use next.js
after try naive create react app. too many setup, switch to next.js
use ts, tailwindcss => faster for react flow integration.
hmm, another frontend framework..
=> doc/next.js.md



## now deal with the react flow
basically, a bunch of UI can drag
probably need to study the graph.json and how to use the UI
where should put stuff

## preview the mock data
bluh.. huge json...
{
    nodes: 
      nodes.data.name is the `form F`
      dependency build on "id", and "data.prerequisites"
    edges:
      Arrows connecting forms (dependencies)
    forms:
      Form definitions (fields, buttons, etc.)
}
probably needs to feed into react flow to present the UI
and nodes have dependency, needs to use DAG to solve something..

## in react flow example 
https://reactflow.dev/components/nodes/base-node
it needs four field,
and it perfect match the "nodes" in the json
``` js
const defaultNodes = [
  {
    id: "1",
    position: { x: 200, y: 200 },
    data: {},
    type: "baseNode",
  },
];
```
the type "form" is should be a customized node
```js
      "id": "form-bad163fd-09bd-4710-ad80-245f31b797d5",
      "type": "form",
      "position": {
        "x": 1437,
        "y": 264
      },
      "data": 

```


https://reactflow.dev/components/edges/data-edge
The edge code example,
it looks like our edges don't require data feature, just source->target is fine
```js
const defaultEdges = [
  {
    id: "1->2",
    source: "1",
    target: "2",
    type: "dataEdge",
    data: { key: "value" },
  } satisfies DataEdge<CounterNodeType>,
];
 
const edgeTypes = {
  dataEdge: DataEdge,
};
```


## go to db to fetch
I quickly create a fetch call to connect the database and fetch to frontend
nodes.type is "form", this should be a customized component
and it seems like it match, they have some connection!
nodes[].data.component_id
forms[].id

ok, so I connect them and build a modal


## Modal
I use two modal(formDetailsModal and PrefillModal, and a generic one)


### the logic of prefill
Step | Action
1 | Find immediate parents from prerequisites
2 | If parent form has same component_id ➔ all fields are eligible
3 | If different component_id ➔ match field names carefully
4 | (Optional) Traverse further to grand-parents (transitive parents)

after checking the form, they are basically the same, but might have to
check if you can not prefill the value that is not there. (❌ ❌ ❌ ignore it now)


✅If you select a prefill source (e.g., from B) for a field in F:
inside F's input_mapping should save those value
```
{
  "email": {
    "fromFormId": "B's node id",
    "fromFieldName": "email"
  },
  "name": {
    "fromFormId": "D's node id",
    "fromFieldName": "name"
  }
}
```



# Make the prefill modal work
I need to pass the `availableSources` into the prefillModal
and nodes(for furture saving in db) and selecteNode(for UI rendering) in the flow would need to update.

now, input_mapping in node
```
input_mapping: {
  button: {
    fromFieldName: "button",
    fromFormId: "form-47c61d17-62b0-4c42-8ca2-0eff641c9d88",
    fromSourceLabel: "Form A"
  },
  label: "Form B"
}
```






















