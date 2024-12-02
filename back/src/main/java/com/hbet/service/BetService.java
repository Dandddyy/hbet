package com.hbet.service;

import com.hbet.dto.BetCreateDTO;
import com.hbet.dto.BetDTO;
import com.hbet.entity.Bet;
import com.hbet.mapper.BetMapper;
import com.hbet.repository.BetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BetService {
    private final BetRepository betRepository;
    private final BetMapper mapper = BetMapper.INSTANCE;
    public BetDTO createBet(BetCreateDTO betCreateDTO) {
        Bet bet = mapper.fromBetCreate(betCreateDTO);
        Bet createdItem = betRepository.save(bet);
        return mapper.toBetDTO(createdItem);
    }

    public List<BetDTO> getBets(Long user_id) {
        List<Bet> bets = betRepository.findAllByUserId(user_id);
        return bets.stream().map(mapper::toBetDTO).toList();
    }

    public List<BetDTO> getBetsByBetTypeId(Long betType_id) {
        List<Bet> bets = betRepository.findAllByBetTypeId(betType_id);
        return bets.stream().map(mapper::toBetDTO).toList();
    }

    public int updateBet(Long id, BetDTO betToUpdate) {
        Optional<Bet> betOptional = betRepository.findById(id);
        if(betOptional.isPresent()) {
            Optional<Bet> bet1 = betRepository.findById(id);
            Bet bet2 = bet1.get();
            Bet bet = betOptional.get();
            bet.setUserId(bet2.getUserId());
            bet.setBetTypeId(bet2.getBetTypeId());
            bet.setAmount(bet2.getAmount());
            bet.setStatus(betToUpdate.getStatus());
            bet.setPotential_win(bet2.getPotential_win());
            Bet updated = betRepository.save(bet);
        }
        return betOptional.isPresent() ? 1 : 0;
    }
}
