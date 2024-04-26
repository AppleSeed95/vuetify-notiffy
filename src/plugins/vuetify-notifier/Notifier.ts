import { App, getCurrentInstance, inject, InjectionKey, mergeProps } from 'vue'
import defaultOptions from './utils/options.json'

import NotifierDialog from './components/NotifierDialog.vue'
import NotifierToast from './components/NotifierToast.vue'
import NotifierComponent from './components/NotifierComponent.vue'

export const NotifierSymbol: InjectionKey<NotifierInstance> = Symbol.for('vuetify:notifier')

import { mountComponent } from './utils'
import { NotifierInstance } from '../../types'

export function createNotifier(app: App, globalOptions: NotifierOptions = {}) {
  const toast = (input: NotifierToastInput): Promise<ConfirmResult> => {
    input.options = mergeProps(defaultOptions.default, defaultOptions.toastOptions, globalOptions?.default as any, globalOptions?.toastOptions as any, input.options as any, { hideSubmit: true })

    return mountComponent({
      component: NotifierToast,
      app,
      input,
    })
  }

  const confirm = (input: NotifierConfirmInput): Promise<ConfirmResult> => {
    input.options = mergeProps(defaultOptions.default, defaultOptions.dialogOptions, globalOptions?.default as any, globalOptions?.dialogOptions as any, input.options as any)

    return mountComponent({
      component: NotifierDialog,
      app,
      input,
    })
  }

  const prompt = (input: NotifierConfirmInput): Promise<ConfirmResult> => {
    input.options = mergeProps(defaultOptions.default, defaultOptions.dialogOptions, globalOptions?.default as any, globalOptions?.dialogOptions as any, input.options as any, { showInput: true })
    
    return mountComponent({
      component: NotifierDialog,
      app,
      input,
    })
  }

  const alert = (input: NotifierConfirmInput): Promise<ConfirmResult> => {
    input.options = mergeProps(defaultOptions.default, defaultOptions.dialogOptions, globalOptions?.default as any, globalOptions?.dialogOptions as any, input.options as any, { hideCancel: true })
    
    return mountComponent({
      component: NotifierDialog,
      app,
      input,
    })
  }

  const component = (input: NotifierConfirmInput): Promise<ConfirmResult> => {    
    input.options = mergeProps(defaultOptions.default, defaultOptions.componentOptions, globalOptions?.default as any, globalOptions?.componentOptions as any, input.options as any)
    
    return mountComponent({
      component: NotifierComponent,
      app,
      input,
    })
  }

  return {
    confirm,

    toast,

    alert,

    prompt,

    component,
  }
}

export function useNotifier(): NotifierInstance {
  const vm = getCurrentInstance()
  if (!vm) {
    throw new Error(`[Vuetify Notifier] useNotifier() must be called from inside a setup function`)
  }

  const notifier = inject(NotifierSymbol)

  if (!notifier) throw new Error('[Vuetify Notifier] Could not find Notifier injection')

  return notifier
}
