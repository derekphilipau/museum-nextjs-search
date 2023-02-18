"use client"
import { useForm, ValidationError } from '@formspree/react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input'

export default function ObjectContactForm({item}) {
  const [state, handleSubmit] = useForm('mwkjldaw');

  console.log('form', item)

  if (state.succeeded) {
    return <p>Thanks for your submission!  We&apos;ll contact you as soon as we can.</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type='hidden' id='objectId' name='objectId' value={item?.id} />
      <input type='hidden' id='objectTitle' name='objectTitle' value={item?.title} />
      <div className='mb-6'>
        Please send us your concerns or corrections about <span className='inline-block italic'>&quot;{item?.title}&quot;</span> here.
      </div>
      <div className='grid w-full max-w-sm items-center gap-1.5'>
        <Label className='mb-2' htmlFor='email'>Email (optional)</Label>
        <Input 
          id='email'
          type='email'
          name='email' 
          placeholder='Email'
        />
        <ValidationError prefix='Email' field='email' errors={state.errors} />
      </div>
      <div className='mt-6 grid w-full max-w-sm items-center gap-1.5'>
        <Label className='mb-2' htmlFor='message'>Your Message</Label>
        <textarea
          className='flex h-20 w-full rounded-md border border-neutral-300 bg-transparent py-2 px-3 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-50 dark:focus:ring-neutral-400 dark:focus:ring-offset-neutral-900'
          id='message'
          name='message' />
        <ValidationError prefix='Email' field='email' errors={state.errors} />
      </div>
      <div className='mt-6 grid w-full max-w-sm items-center gap-1.5'>
        <Button type='submit' disabled={state.submitting}>
          Submit your feedback!
        </Button>
        <ValidationError errors={state.errors} />
      </div>
    </form>
  );
}