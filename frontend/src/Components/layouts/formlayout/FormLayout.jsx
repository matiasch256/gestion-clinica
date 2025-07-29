import { Form } from "../../Components/form/Form";
import { NavLink } from "react-router-dom";

export const FormLayout = ({ formToggle, formTitle, submitButtonText }) => {
  return (
    <div className="m-auto flex flex-col w-9/12">
      <Form
        formToggle={formToggle}
        formTitle={formTitle}
        submitButtonText={submitButtonText}
      ></Form>
      <div className="w-52 self-center my-6 flex justify-center">
        {/* <NavLink to={"/"}>
        <button className='text-whitish my-2 ml-2 px-10 py-2 cursor-pointer rounded-md hover:transition hover:duration-100 hover:text-white hover:bg-button-blue shadow-inner shadow-button-blue self-center text-md w-48'>
          Back to Home
        </button>
      </NavLink> */}
      </div>
    </div>
  );
};
