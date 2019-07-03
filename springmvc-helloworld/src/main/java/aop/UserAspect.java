//package aop;
//
//import java.util.ArrayList;
//
//import org.apache.commons.collections.map.MultiValueMap;
//import org.aspectj.lang.JoinPoint;
//import org.aspectj.lang.annotation.After;
//import org.aspectj.lang.annotation.Around;
//import org.aspectj.lang.annotation.Aspect;
//import org.aspectj.lang.annotation.Before;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.core.annotation.Order;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//
//import jbr.springmvc.controller.UserNotFoundException;
//import jbr.springmvc.controller.UserNotVerifiedException;
//import jbr.springmvc.dao.UserDao;
//import jbr.springmvc.model.UserEntity;
//
//
//
//@Aspect
//public class UserAspect {
//	@Autowired
//	public UserDao userdao;
//
//	
//	@Before("execution(public * jbr.springmvc.controller.UserController.getUser(..))")
//	public void validateVerified(JoinPoint joinPoint) throws Exception {		
//		System.out.printf("Doing validation prior to the execution of the method %s\n", joinPoint.getSignature().getName());
//		Object[] arr = (joinPoint.getArgs());
//		System.out.println(arr[0]);
//		MultiValueMap formParams=(MultiValueMap) arr[0];
//		String email =((ArrayList) formParams.get("email")).get(0).toString(); 
//		 String password = ((ArrayList) formParams.get("password")).get(0).toString();
//		 System.out.println("email" + email);
//		 System.out.println("pass" + password);
//		 
//		 
//		 joinPoint.proceed()
////		 UserEntity user;
////			try {
////				user = userdao.getUser(new String(email));
////				System.out.println("user:" + user.getName());
////				
////
////				if (user == null) {
////					throw new UserNotFoundException();
////				}
////			} catch (Exception e) {
////				return new ResponseEntity<String>(HttpStatus.NOT_FOUND);
////			}
//		
////			try {
////				user = userdao.getUser(new String(email));
////				if (!password.equals(user.getPassword())){
////					throw new UserNotFoundException();	
////				}
////			}
////				catch (Exception e) {
////					return new ResponseEntity<String>(HttpStatus.UNAUTHORIZED);
////				}
////			
////			
////			try {
////				user = userdao.getUser(new String(email));
////			
////			  Boolean verified= user.getVerified(); System.out.println(verified);
////			  
////			  if (verified==false){ throw new UserNotVerifiedException(); }
////			 
////			}
////				catch (Exception e) {
////					return new ResponseEntity<String>(HttpStatus.UNAUTHORIZED);
////				}
//			
//			
//	}
//}
