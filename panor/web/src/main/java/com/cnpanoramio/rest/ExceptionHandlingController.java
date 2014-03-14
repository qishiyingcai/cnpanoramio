package com.cnpanoramio.rest;

import java.sql.SQLException;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class ExceptionHandlingController {
	// @RequestHandler methods
	private transient final Log logger = LogFactory.getLog(getClass());

	  // Exception handling methods

	  // Convert a predefined exception to an HTTP Status code
	  @ResponseStatus(value=HttpStatus.CONFLICT, reason="Data integrity violation")  // 409
	  @ExceptionHandler(DataIntegrityViolationException.class)
	  public void conflict() {
	    // Nothing to do
	  }

	  @ResponseStatus(value=HttpStatus.NOT_FOUND, reason="data not found")
	  // Specify the name of a specific view that will be used to display the error:
	  @ExceptionHandler({SQLException.class, DataAccessException.class})
	  public String databaseError() {
	    // Nothing to do.  Returns the logical view name of an error page, passed to
	    // the view-resolver(s) in usual way.
	    // Note that the exception is _not_ available to this view (it is not added to
	    // the model) but see "Extending ExceptionHandlerExceptionResolver" below.
	    return "databaseError";
	  }

	  // Total control - setup a model and return the view name yourself. Or consider
	  // subclassing ExceptionHandlerExceptionResolver (see below).
	  @ExceptionHandler(Exception.class)
	  public ModelAndView handleError(HttpServletRequest req, Exception exception) {
	    logger.error("Request: " + req.getRequestURL() + " raised " + exception);

	    ModelAndView mav = new ModelAndView();
	    mav.addObject("exception", exception);
	    mav.addObject("url", req.getRequestURL());
	    mav.setViewName("error");
	    return mav;
	  }
}
