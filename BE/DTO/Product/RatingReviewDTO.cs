using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO.Product
{
    public class RatingReviewDTO
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public Guid UserId { get; set; }
        public double Rating { get; set; }
        public string Review { get; set; }
        public bool IsDeleted { get; set; }
    }
}
