import {
    STAGES,
    initialStage,
    stageOne
  } from './stages/index.js'
  
  import { storage } from './storage.js'
  
  export const stages = [
    {
      descricao: 'Welcome',
      stage: initialStage,
    },
    {
      descricao: 'Greetings',
      stage: stageOne
    }
  ]
  
  export function getStage({ from }) {
    if (storage[from]) {
      return storage[from].stage
    }
  
    storage[from] = {
      stage: STAGES.INITIAL,
      itens: [],
      address: '',
    }
  
    return storage[from].stage
  }