import test from 'node:test';
import assert from 'node:assert/strict';
import {validateExplicitStructure as validate} from '../../lib/novel-revision/explicit-structure.mjs';
const before=[0,1,2].map(i=>({en:{body:`EN${i}`},ko:{body:`KO${i}`}}));
const after={en:['new EN0','EN1'],ko:['new KO0','KO1']};
const mixed=()=>({outputs:[{operation:'replace',sources:[0]},{operation:'preserve',sources:[1]}],deleted:[2]});
test('mixed replacement/preservation/exclusion records precise predecessors',()=>{
 const result=validate(mixed(),before,after);
 assert.deepEqual(result.outputs.map(x=>x.operation),['replace','preserve']);
 assert.deepEqual(result.deleted_predecessor_indexes,[2]);
});
test('preservation rejects a one-language text change',()=>assert.throws(()=>validate(mixed(),before,{...after,ko:['new KO0','changed']})));
test('missing and double-assigned predecessors fail closed',()=>{
 const a=mixed();a.deleted=[];assert.throws(()=>validate(a,before,after));
 const b=mixed();b.deleted=[1,2];assert.throws(()=>validate(b,before,after));
});
test('unchanged output must not request a replacement',()=>{const s=mixed();s.outputs[1].operation='replace';assert.throws(()=>validate(s,before,after));});
test('equal counts can explicitly represent merge plus split; no count inference',()=>{
 const s={outputs:[{operation:'merge',sources:[0,1]},{operation:'split',sources:[2]},{operation:'split',sources:[2]}],deleted:[]};
 assert.equal(validate(s,before,{en:['a','b','c'],ko:['가','나','다']}).outputs[0].operation,'merge');
});
test('a split must have multiple outputs, and cannot overlap another operation',()=>{
 assert.throws(()=>validate({outputs:[{operation:'split',sources:[0]},{operation:'merge',sources:[1,2]}],deleted:[]},before,after));
 assert.throws(()=>validate({outputs:[{operation:'replace',sources:[0]},{operation:'merge',sources:[0,1,2]}],deleted:[]},before,after));
});
