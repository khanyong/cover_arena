import test from 'node:test';
import assert from 'node:assert/strict';
import {hasDisplayedKorean} from '../../shared/lib/koreanLanguageBadge.js';
const props={novelSlug:'quantum-vibration-novel',scene:{paragraphs:[{id:'unit',activeVersion:'review',versions:{review:{content:'현재 국문'},old:{content:'English only'}}}]}};
test('language label is independent of edition name and paragraph count',()=>{
 for(const manuscriptVersion of ['r01','equations-v1','style-r01'])assert.equal(hasDisplayedKorean({...props,scene:{...props.scene,manuscriptVersion}}),true);
});
test('label follows displayed version and never labels English reader',()=>{
 assert.equal(hasDisplayedKorean({...props,customVersionMap:{unit:'old'}}),false);
 assert.equal(hasDisplayedKorean({...props,novelSlug:'quantum-vibration-novel-en'}),false);
 assert.equal(hasDisplayedKorean({...props,scene:{paragraphs:[]}}),false);
 assert.equal(hasDisplayedKorean({...props,customVersionMap:{unit:'missing'}}),false);
});
