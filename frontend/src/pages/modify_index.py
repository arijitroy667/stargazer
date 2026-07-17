import re

file_path = r"c:\Users\ariji\Desktop\github\stargazer-social-galaxy\frontend\src\pages\Index.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace the form submission block
old_form_start = """                {/* Login/SignUp form submission */}"""
old_form_end = """← Back to landing
                  </button>
                </div>"""

# Find the exact match
start_idx = content.find(old_form_start)
end_idx = content.find(old_form_end) + len(old_form_end)

if start_idx != -1 and end_idx != -1:
    new_form = """                {/* Login/SignUp form submission */}
                <div className="flex flex-col items-center justify-center space-y-6">
                  <Button
                    onClick={() => {
                      window.location.href = `${apiUrl}/users/auth/google`;
                    }}
                    className="w-full bg-white text-black hover:bg-neutral-200 flex items-center justify-center space-x-2 py-6 text-lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                      className="w-6 h-6"
                    >
                      <path
                        fill="#FFC107"
                        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                      />
                      <path
                        fill="#FF3D00"
                        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                      />
                      <path
                        fill="#4CAF50"
                        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                      />
                      <path
                        fill="#1976D2"
                        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </Button>
                  <button
                    onClick={() => setCurrentView("landing")}
                    className="text-purple-300 hover:text-white transition-colors text-sm"
                  >
                    ← Back to landing
                  </button>
                </div>"""
    content = content[:start_idx] + new_form + content[end_idx:]

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Modification complete")
