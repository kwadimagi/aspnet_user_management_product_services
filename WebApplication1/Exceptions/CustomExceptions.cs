namespace WebApplication1.Exceptions
{
    public class ResourceNotFoundException : Exception
    {
        public ResourceNotFoundException(string name, object key) : base($"Entity '{name}' with key '{key}' was not found.") { }
    }

    public class BusinessException : Exception
    {
        public BusinessException(string message) : base(message) { }
    }

    public class ValidationException : Exception
    {
        public ValidationException(string message) : base(message) { }
    }
}