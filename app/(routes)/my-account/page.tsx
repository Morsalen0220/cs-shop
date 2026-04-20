import AccountForm from "@/components/account/account-form";
import Container from "@/components/ui/container";

const MyAccountPage = () => {
  return (
    <div className="bg-[#f6f6f3]">
      <Container>
        <div className="px-4 py-8 sm:px-6 lg:px-8">
          <AccountForm />
        </div>
      </Container>
    </div>
  );
};

export default MyAccountPage;
