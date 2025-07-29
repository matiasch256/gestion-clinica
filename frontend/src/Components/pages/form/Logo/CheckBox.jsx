export const Checkbox = ({labelName, labelContent, showToggle}) => {

    return <> 
    <div className={'flex flex-row items-center justify-center my-2 border-red-50 ' + (showToggle? '' : 'hidden')}>
      <label htmlFor={labelName} className='inline-block mr-2'>{labelContent}</label>
      <input type='checkbox' id={labelName} name={labelName} className=''/>
    </div>
    </>
  
  }