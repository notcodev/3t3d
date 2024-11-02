import { reflect } from '@effector/reflect'
import { useUnit } from 'effector-react'
import { ComponentProps, useEffect } from 'react'

import {
  Button,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui'

import { signupModel } from './model'

const Input = (props: ComponentProps<'input'>) => <input {...props} />

const UsernameField = reflect({
  view: Input,
  bind: {
    value: signupModel.usernameField.$value,
    onChange: (event) => signupModel.usernameField.changed(event.target.value),
    disabled: signupModel.$isPending,
  },
})

const FirstnameField = reflect({
  view: Input,
  bind: {
    value: signupModel.firstnameField.$value,
    onChange: (event) => signupModel.firstnameField.changed(event.target.value),
    disabled: signupModel.$isPending,
  },
})

const LastnameField = reflect({
  view: Input,
  bind: {
    value: signupModel.lastnameField.$value,
    onChange: (event) => signupModel.lastnameField.changed(event.target.value),
    disabled: signupModel.$isPending,
  },
})

const PasswordField = reflect({
  view: Input,
  bind: {
    value: signupModel.passwordField.$value,
    onChange: (event) => signupModel.passwordField.changed(event.target.value),
    disabled: signupModel.$isPending,
  },
})

export const Signup = () => {
  const formSubmitted = useUnit(signupModel.formSubmitted)
  const componentUnmounted = useUnit(signupModel.componentUnmounted)

  useEffect(() => componentUnmounted, [componentUnmounted])

  return (
    <>
      <DialogHeader>
        <DialogTitle>It's profile</DialogTitle>
        <DialogDescription>Example</DialogDescription>
      </DialogHeader>
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          formSubmitted()
        }}
      >
        <UsernameField />
        <FirstnameField />
        <LastnameField />
        <PasswordField />

        <Button type="submit">Register</Button>
      </form>
    </>
  )
}
