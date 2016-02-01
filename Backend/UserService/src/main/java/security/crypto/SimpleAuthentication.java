package security.crypto;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class SimpleAuthentication {
	public static String passwordMatcher(String password, String encodedPassword){
		BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
		if(passwordEncoder.matches(password, encodedPassword))
		return "matched!";
		else return "not match";
	}
}
