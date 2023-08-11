import Title from './Title'
import { BarsArrowDownIcon } from '@heroicons/react/24/solid'
import DateRangePicker from './RangeDatePicker';
import Barchart from './BarChart';
import AreaChartC from './AreaChart';

export default function Sidebar({ repository, setModal, stat_name, stat_var, nam_var, nam_stat }) {

  const closeModal = () => {
    setModal(true);
  };

  return (
    <>
      <div className='flex flex-col p-2 w-full bg-slate-100' style={{ height: '100%', width: '100%' }}>
        <Title
          title={'LlinpayTime'}
          style={'text-3xl'}
        />
        <div className='flex flex-col w-full h-full'>
          <div className='h-1/6 p-3 w-full '>
            <div className='w-full flex flex-row '>
              <div className='border-2 text-center border-zinc-400 w-4/5 rounded-md p-2 items-center'>
                {repository}
              </div>
              <div className='w-1/5 px-5'>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-xl"
                  onClick={closeModal} 
                >
                  <BarsArrowDownIcon className='w-7 h-7' />
                </button>
              </div>
            </div>
            <div className='w-full p-1 py-3'>
              <DateRangePicker />
            </div>
          </div>
          <div className='h-2/6'>
            <AreaChartC station={nam_stat} vari={nam_var} />
          </div>
          <div className='h-3/6 p-2 bg-slate-100'>
            <Barchart station_name={stat_name} data={stat_var} />
          </div>
        </div>
      </div>
    </>
  )
} 