# Update Note

### Feb, 06

##### File Service 

DONE!
both upload and download T_T finally ...

======================================================================

### Feb, 01

##### Register Function (in User service)

a basic function of registration is implemented

user's password will be encrypted by BCrypt which is recommended by Spring to use this one

In the old way, we use SHA1 and (I'm not sure the name) but BCrypt is more modern 

**remaining task**

- find if email available to use
- check password format
- check email format

##### Login function (in User service)

just a mock up one to check if(rawPW.equals(encodedPW)) by BCryptPasswordEncoder.match()

**frontend bugs**

- unexpected token m: Object.parse() T_T BUT! the password matching works!

##### File Service

I'M SORRY STILL BUG!!!!

======================================================================

#### Jan, 29: 

IT MAY CAUSE Err: main.Application not found 
from fixed directory in .classpath, I'm trying to figure out
if you know how please tell me T_T

======================================================================