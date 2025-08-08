import { Form } from "../../Components/form/Form";

export const FormLayout = ({ formToggle, formTitle, submitButtonText }) => {
  return (
    <div className="m-auto flex flex-col w-9/12">
      <Form
        formToggle={formToggle}
        formTitle={formTitle}
        submitButtonText={submitButtonText}
      ></Form>
      <div className="w-52 self-center my-6 flex justify-center"></div>
    </div>
  );
};
