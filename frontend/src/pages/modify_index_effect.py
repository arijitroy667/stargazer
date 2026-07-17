import re

file_path = r"c:\Users\ariji\Desktop\github\stargazer-social-galaxy\frontend\src\pages\Index.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

injection = """  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const response = await axios.get(`${apiUrl}/users/current-user`, {
          withCredentials: true,
        });
        if (response.data.success && response.data.data) {
          setUser(response.data.data);
          localStorage.setItem("user", JSON.stringify(response.data.data));
          setCurrentView("dashboard");
        }
      } catch (error) {
        // Not logged in or session expired
      }
    };
    if (!user) {
      checkCurrentUser();
    }
  }, []);

"""

# Insert the code right before const [activeTab, setActiveTab]
target = '  const [activeTab, setActiveTab] = useState("socials");'
if target in content:
    content = content.replace(target, injection + target)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
