using Microsoft.AspNetCore.Mvc;
using WebApplication1.DTOs;
using WebApplication1.Services.Auth;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        /// <summary>
        /// Register a new user
        /// </summary>
        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = string.Join(", ", ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage));
                    return BadRequest(new AuthResponseDto
                    {
                        Success = false,
                        Message = errors
                    });
                }

                if (model.Password != model.ConfirmPassword)
                {
                    return BadRequest(new AuthResponseDto
                    {
                        Success = false,
                        Message = "Passwords do not match!"
                    });
                }

                var (success, message) = await _authService.RegisterUserAsync(model.Email, model.Password);

                if (!success)
                {
                    return BadRequest(new AuthResponseDto
                    {
                        Success = false,
                        Message = message
                    });
                }

                return Ok(new AuthResponseDto
                {
                    Success = true,
                    Message = message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during user registration");
                return StatusCode(500, new AuthResponseDto
                {
                    Success = false,
                    Message = "An error occurred while processing your request"
                });
            }
        }

        /// <summary>
        /// Login user and return JWT token
        /// </summary>
        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(LoginDto model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = string.Join(", ", ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage));
                    return BadRequest(new AuthResponseDto
                    {
                        Success = false,
                        Message = errors
                    });
                }

                var (success, token, message) = await _authService.LoginUserAsync(model.Email, model.Password);

                if (!success)
                {
                    return Unauthorized(new AuthResponseDto
                    {
                        Success = false,
                        Message = message
                    });
                }

                return Ok(new AuthResponseDto
                {
                    Success = true,
                    Message = message,
                    Token = token,
                    ExpiresAt = DateTime.Now.AddHours(3)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during user login");
                return StatusCode(500, new AuthResponseDto
                {
                    Success = false,
                    Message = "An error occurred while processing your request"
                });
            }
        }

        /// <summary>
        /// Change user password
        /// </summary>
        [HttpPut("changepassword")]
        public async Task<ActionResult<AuthResponseDto>> ChangePassword(ChangePasswordDto model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = string.Join(", ", ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage));
                    return BadRequest(new AuthResponseDto
                    {
                        Success = false,
                        Message = errors
                    });
                }

                if (model.NewPassword != model.ConfirmNewPassword)
                {
                    return BadRequest(new AuthResponseDto
                    {
                        Success = false,
                        Message = "New passwords do not match!"
                    });
                }

                var email = User.Identity?.Name;
                if (string.IsNullOrEmpty(email))
                {
                    return Unauthorized(new AuthResponseDto
                    {
                        Success = false,
                        Message = "User not authenticated"
                    });
                }

                var success = await _authService.ChangePasswordAsync(email, model.CurrentPassword, model.NewPassword);

                if (!success)
                {
                    return BadRequest(new AuthResponseDto
                    {
                        Success = false,
                        Message = "Failed to change password"
                    });
                }

                return Ok(new AuthResponseDto
                {
                    Success = true,
                    Message = "Password changed successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during password change");
                return StatusCode(500, new AuthResponseDto
                {
                    Success = false,
                    Message = "An error occurred while processing your request"
                });
            }
        }
    }
}