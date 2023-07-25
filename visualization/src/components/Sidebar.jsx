import { useState } from 'react'
import Title from './Title'

export default function Sidebar() {

  return (
    <div className='Sidebar'>
      <div className='p-2'>
        <Title
          title={'LlinpayTime'}
          style={'text-3xl'}
        />
      </div>
    </div>
  )
} 