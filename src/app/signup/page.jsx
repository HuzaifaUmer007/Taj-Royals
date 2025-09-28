import AuthForm from '@/components/AuthForm';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function SignupPage() {
  return (
    <ProtectedRoute requireAuth={false} redirectTo="/cart">
      <AuthForm mode="signup" />
    </ProtectedRoute>
  );
}
