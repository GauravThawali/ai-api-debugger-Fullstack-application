namespace API_Debugger.Models
{
    public class DebugResponse
    {
        public string Explanation { get; set; }
        public string RootCause { get; set; }
        public string FixSuggestion { get; set; }
        public string Severity { get; set; }
    }
}
