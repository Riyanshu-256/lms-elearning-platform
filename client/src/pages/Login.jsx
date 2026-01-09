import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* defaultValue FIX */}
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signup">Signup</TabsTrigger>
            <TabsTrigger value="login">Login</TabsTrigger>
          </TabsList>

          {/* SIGNUP */}
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  Enter your details to create a new account
                </CardDescription>
              </CardHeader>

              <CardContent className="grid gap-4">
                <div>
                  <Label>Name</Label>
                  <Input placeholder="John Doe" required="true" />
                </div>

                <div>
                  <Label>Email</Label>
                  <Input type="email" placeholder="john@example.com" />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input type="password" placeholder="•••••••••••" />
                </div>
              </CardContent>

              <CardFooter>
                <Button className="w-full">Create Account</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* LOGIN */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>Login to your account</CardDescription>
              </CardHeader>

              <CardContent className="grid gap-4">
                <div>
                  <Label>Email</Label>
                  <Input type="email" placeholder="john@example.com" />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input type="password" placeholder="•••••••••••" />
                </div>
              </CardContent>

              <CardFooter>
                <Button className="w-full">Login</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Login;
