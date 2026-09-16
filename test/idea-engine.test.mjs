import test from 'node:test';
import assert from 'node:assert/strict';
import {IDEAS,pickIdea,normalizeMural} from '../dist/idea-engine.mjs';

test('cada território entrega um primeiro passo e evita repetição imediata',()=>{
  for(const topic of ['digital','art','everyday','all']) {
    let previous;
    for(let index=0;index<40;index++) {
      const idea=pickIdea(topic,previous,()=>index%2?0:.999999);
      assert.notEqual(idea.id,previous);
      assert.ok(topic==='all'||idea.topic===topic);
      assert.ok(idea.step.length>20);
      previous=idea.id;
    }
  }
  assert.equal(new Set(IDEAS.map(idea=>idea.id)).size,IDEAS.length);
});

test('mural corrompido não quebra a sessão e dados recuperados têm limites',()=>{
  assert.deepEqual(normalizeMural({unexpected:true}),[]);
  const valid={id:'1',topic:'art',title:'uma ideia?',note:'<script>literal</script>',step:'Um rascunho.'};
  const result=normalizeMural([null,{},valid,{...valid},{id:'2',topic:'invalid',title:'x'},{...valid,id:'3',note:'a'.repeat(500),title:'b'.repeat(300)}]);
  assert.equal(result.length,2);
  assert.equal(result[0].note,'<script>literal</script>');
  assert.equal(result[1].note.length,280);
  assert.equal(result[1].title.length,180);
});
