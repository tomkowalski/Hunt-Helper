<?php
	$userGroup = <<<__QUERY
	CREATE TABLE IF NOT EXISTS `userGroup` (
  		`name` varchar(255) NOT NULL,
  		`ID` int(11) NOT NULL AUTO_INCREMENT,
  		`password` int(30) NOT NULL,
  		PRIMARY KEY (`ID`)
	) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

__QUERY;
	$place = <<<__QUERY
	CREATE TABLE IF NOT EXISTS `place` (
  		`name` varchar(255) NOT NULL,
  		`address` text NOT NULL,
  		`lat` double NOT NULL,
  		`lng` double NOT NULL,
  		`group_key` int(11) NOT NULL,
  		`sub_group` int(11) DEFAULT NULL,
  		`position` int(11) DEFAULT NULL,
  		`visited` tinyint(1) NOT NULL DEFAULT '0',
  		`ID` int(11) NOT NULL AUTO_INCREMENT,
  		PRIMARY KEY (`ID`)
	) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
__QUERY;
	$user = <<<__QUERY
	CREATE TABLE IF NOT EXISTS `user` (
	  	`firstName` varchar(35) NOT NULL,
	  	`lastName` varchar(35) NOT NULL,
	  	`username` varchar(35) NOT NULL,
	  	`pass` varchar(30) NOT NULL,
	  	`email` varchar(255) NOT NULL,
	  	`groupKey` int(11) DEFAULT NULL,
	  	`subGroup` int(11) DEFAULT NULL,
	  	`ID` int(11) NOT NULL AUTO_INCREMENT,
	  	PRIMARY KEY (`ID`)
	) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=58;
__QUERY;

?>